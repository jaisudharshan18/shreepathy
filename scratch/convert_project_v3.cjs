const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.resolve(__dirname, '../src');
const appDir = path.resolve(__dirname, '../app');
const componentsDir = path.resolve(__dirname, '../components');

// Recreate src/components and src/pages
function initDirectories() {
  const compDir = path.join(srcDir, 'components');
  const pagesDir = path.join(srcDir, 'pages');

  if (fs.existsSync(compDir)) {
    fs.rmSync(compDir, { recursive: true, force: true });
  }
  fs.mkdirSync(compDir, { recursive: true });

  if (fs.existsSync(pagesDir)) {
    fs.rmSync(pagesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(pagesDir, { recursive: true });
}

function transpileFile(srcPath, loader) {
  let content = fs.readFileSync(srcPath, 'utf8');

  // Strip TypeScript types, interfaces, satisfies, etc. using esbuild
  let transpiled;
  try {
    const result = esbuild.transformSync(content, {
      loader: loader,
      jsx: 'preserve',
      charset: 'utf8',
      minify: false,
    });
    transpiled = result.code;
  } catch (err) {
    console.error(`Esbuild failed to compile ${srcPath}:`, err.message);
    // fallback to original content to let regex handle it
    transpiled = content;
  }

  // Next.js components & routers replacements (handles both ' and ")
  transpiled = transpiled.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
  transpiled = transpiled.replace(/import\s+\{\s*(useRouter|usePathname|useSearchParams)\s*\}\s+from\s+['"]next\/navigation['"];?/g, "import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';");
  
  // Strip Image imports and replace with standard img tag
  transpiled = transpiled.replace(/import\s+Image\s+from\s+['"]next\/image['"];?/g, '');
  transpiled = transpiled.replace(/<Image/g, '<img');
  transpiled = transpiled.replace(/<\/Image>/g, '</img>');

  // Replace links `href` with `to`
  transpiled = transpiled.replace(/<Link\s+href=/g, '<Link to=');
  transpiled = transpiled.replace(/<Link\s+([^>]*?)href=/g, '<Link $1to=');

  // Replace routers
  transpiled = transpiled.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate()');
  transpiled = transpiled.replace(/router\.push\(/g, 'navigate(');
  transpiled = transpiled.replace(/router\.replace\(/g, 'navigate(');
  transpiled = transpiled.replace(/const\s+pathname\s*=\s*usePathname\(\)/g, 'const { pathname } = useLocation()');

  // Server actions and Cache helpers
  transpiled = transpiled.replace(/['"]use server['"]/g, '// "use server"');
  transpiled = transpiled.replace(/import\s+\{\s*revalidatePath\s*\}\s+from\s+['"]next\/cache['"];?/g, 'const revalidatePath = () => {}');
  transpiled = transpiled.replace(/import\s+\{\s*redirect\s*\}\s+from\s+['"]next\/navigation['"];?/g, 'const redirect = (url) => { window.location.href = url }');

  // Remove next/headers cookies/headers if any
  transpiled = transpiled.replace(/import\s+\{\s*(cookies|headers)\s*\}\s+from\s+['"]next\/headers['"]/g, 'const $1 = () => ({ get: () => null })');

  // Handle notFound
  transpiled = transpiled.replace(/import\s+\{\s*notFound\s*\}\s+from\s+['"]next\/navigation['"]/g, '');
  transpiled = transpiled.replace(/if\s*\(\s*!([a-zA-Z0-9_]+)\s*\)\s*\{\s*notFound\(\);?\s*\}/g, 'if (!$1) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;');
  transpiled = transpiled.replace(/if\s*\(\s*!([a-zA-Z0-9_]+)\s*\)\s*notFound\(\);?/g, 'if (!$1) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;');

  return transpiled;
}

// Convert components recursively
function convertComponents(src, dest) {
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      const destPath = path.join(dest, item);
      fs.mkdirSync(destPath, { recursive: true });
      convertComponents(srcPath, destPath);
    } else {
      const ext = path.extname(item);
      if (ext === '.ts' || ext === '.tsx') {
        const destItem = item.replace(ext, ext === '.ts' ? '.js' : '.jsx');
        const destPath = path.join(dest, destItem);
        const code = transpileFile(srcPath, ext === '.ts' ? 'ts' : 'tsx');
        fs.writeFileSync(destPath, code, 'utf8');
      }
    }
  }
}

// Helper to check if file has default export function
function wrapPageWithHOC(code) {
  const match = code.match(/export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/);
  if (match) {
    const funcName = match[1];
    code = code.replace(/export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/, 'async function $1');
    code = `import { useParams, useSearchParams } from 'react-router-dom';\nimport { createAsyncPage } from '@/lib/asyncPage';\n` + code;
    code += `\nexport default createAsyncPage(${funcName});\n`;
  }
  return code;
}

// Helper to convert layouts from Next.js (children) to React Router (Outlet)
function convertLayoutCode(code) {
  // Replace the component function signature to have no parameters
  code = code.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(\{\s*children\s*\}\)/g, 'export default function $1()');
  code = code.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(\s*props\s*\)/g, 'export default function $1()');
  code = code.replace(/\(\{\s*children\s*\}\)/g, '()');
  
  // Replace {children} inside the JSX return
  code = code.replace(/\{children\}/g, '<Outlet />');
  
  // Inject Outlet import
  code = `import { Outlet } from 'react-router-dom';\n` + code;
  return code;
}

// Convert a single page file
function convertPageFile(srcPath, destPath, isPage = true) {
  const ext = path.extname(srcPath);
  let code = transpileFile(srcPath, ext === '.ts' ? 'ts' : 'tsx');
  if (isPage && srcPath.endsWith('page.tsx')) {
    code = wrapPageWithHOC(code);
  }
  fs.writeFileSync(destPath, code, 'utf8');
}

// Convert folder recursively, maintaining folder structure inside dest
function convertFolder(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      // Skip nested parameter route folders here since they are handled separately
      if (item.startsWith('[') && item.endsWith(']')) continue;
      convertFolder(srcPath, path.join(dest, item));
    } else {
      const ext = path.extname(item);
      if (ext === '.ts' || ext === '.tsx') {
        const destName = item === 'page.tsx' ? 'page.jsx' : item.replace(ext, ext === '.ts' ? '.js' : '.jsx');
        convertPageFile(srcPath, path.join(dest, destName), item === 'page.tsx');
      }
    }
  }
}

// Detailed mapping of single pages
const singlePages = [
  { src: '(marketing)/page.tsx', dest: 'Home.jsx' },
  { src: '(marketing)/about/page.tsx', dest: 'About.jsx' },
  { src: '(marketing)/brands/page.tsx', dest: 'brands/page.jsx' },
  { src: '(marketing)/brands/[slug]/page.tsx', dest: 'brands/details.jsx' },
  { src: '(shop)/category/[slug]/page.tsx', dest: 'category/details.jsx' },
  { src: '(shop)/products/[slug]/page.tsx', dest: 'products/details.jsx' },
  { src: '(account)/account/page.tsx', dest: 'account/page.jsx' },
  { src: '(account)/account/orders/page.tsx', dest: 'account/orders/page.jsx' },
  { src: '(account)/account/rewards/page.tsx', dest: 'account/rewards/page.jsx' },
  { src: '(admin)/admin/page.tsx', dest: 'admin/page.jsx' },
  { src: '(admin)/admin/analytics/page.tsx', dest: 'admin/analytics/page.jsx' },
];

// Folders containing sibling files (e.g. ProductsAdmin.tsx, actions.ts)
const pageFolders = [
  { src: '(marketing)/contact', dest: 'contact' },
  { src: '(shop)/products', dest: 'products' }, // this copies page.tsx -> page.jsx and CatalogBrowser.tsx -> CatalogBrowser.jsx
  { src: '(admin)/admin/brands', dest: 'admin/brands' },
  { src: '(admin)/admin/categories', dest: 'admin/categories' },
  { src: '(admin)/admin/chatbot', dest: 'admin/chatbot' },
  { src: '(admin)/admin/content', dest: 'admin/content' },
  { src: '(admin)/admin/customers', dest: 'admin/customers' },
  { src: '(admin)/admin/enquiries', dest: 'admin/enquiries' },
  { src: '(admin)/admin/leads', dest: 'admin/leads' },
  { src: '(admin)/admin/loyalty', dest: 'admin/loyalty' },
  { src: '(admin)/admin/orders', dest: 'admin/orders' },
  { src: '(admin)/admin/products', dest: 'admin/products' },
  { src: '(admin)/admin/settings', dest: 'admin/settings' },
];

function main() {
  console.log('Initializing directory structure…');
  initDirectories();

  console.log('Converting components folder recursively…');
  convertComponents(componentsDir, path.join(srcDir, 'components'));

  console.log('Converting layout components…');
  // Transpile layout files and save in src/pages
  const layouts = [
    { src: '(marketing)/layout.tsx', dest: 'MarketingLayout.jsx' },
    { src: '(shop)/layout.tsx', dest: 'ShopLayout.jsx' },
    { src: '(account)/layout.tsx', dest: 'AccountLayout.jsx' },
    { src: '(admin)/layout.tsx', dest: 'AdminLayout.jsx' },
  ];
  for (const layout of layouts) {
    const srcPath = path.join(appDir, layout.src);
    const destPath = path.join(srcDir, 'pages', layout.dest);
    let code = transpileFile(srcPath, 'tsx');
    code = convertLayoutCode(code);
    fs.writeFileSync(destPath, code, 'utf8');
    console.log(`Converted layout: ${layout.dest}`);
  }

  console.log('Converting single page files…');
  for (const page of singlePages) {
    const srcPath = path.join(appDir, page.src);
    const destPath = path.join(srcDir, 'pages', page.dest);
    
    // Ensure parent directories exist
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    convertPageFile(srcPath, destPath, true);
    console.log(`Converted page: ${page.dest}`);
  }

  console.log('Converting page folders recursively…');
  for (const folder of pageFolders) {
    const srcPath = path.join(appDir, folder.src);
    const destPath = path.join(srcDir, 'pages', folder.dest);
    convertFolder(srcPath, destPath);
    console.log(`Converted page folder: ${folder.dest}`);
  }

  console.log('All migrations completed.');
}

main();
