const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');
const appDir = path.resolve(__dirname, '../app');
const componentsDir = path.resolve(__dirname, '../components');
const libDir = path.resolve(__dirname, '../lib');

// Recreate clean src directory structure
function initDirectories() {
  if (fs.existsSync(srcDir)) {
    fs.rmSync(srcDir, { recursive: true, force: true });
  }
  fs.mkdirSync(srcDir);
  fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
  fs.mkdirSync(path.join(srcDir, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(srcDir, 'lib'), { recursive: true });
}

function stripTS(content) {
  let code = content;

  // 1. Remove type imports
  code = code.replace(/import type\s+[\s\S]*?;\n/g, '');
  code = code.replace(/import\s+\{\s*type\s+[\s\S]*?\}\s+from\s+.*?;\n/g, '');

  // 2. Remove Next.js metadata and specific declarations
  code = code.replace(/export\s+const\s+metadata\s*=\s*[\s\S]*?;\n/g, '');
  code = code.replace(/export\s+const\s+dynamic\s*=\s*[\s\S]*?;\n/g, '');

  // 3. Next.js router & links
  code = code.replace(/import Link from 'next\/link'/g, "import { Link } from 'react-router-dom'");
  code = code.replace(/import\s+\{\s*(useRouter|usePathname|useSearchParams)\s*\}\s+from\s+'next\/navigation'/g, "import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'");
  code = code.replace(/import\s+Image\s+from\s+'next\/image'/g, '');

  // 4. TS interfaces, types, enums
  code = code.replace(/(?:export\s+)?interface\s+[A-Za-z0-9_]+\s*\{[\s\S]*?\n\}/g, '');
  code = code.replace(/(?:export\s+)?type\s+[A-Za-z0-9_]+\s*=\s*[\s\S]*?;/g, '');
  code = code.replace(/(?:export\s+)?enum\s+[A-Za-z0-9_]+\s*\{[\s\S]*?\n\}/g, '');

  // 5. Type casts and satisfies
  code = code.replace(/\s+satisfies\s+[A-Za-z0-9_.]+/g, '');
  code = code.replace(/\s+as\s+[A-Za-z0-9_.[\]]+/g, '');
  
  // 6. Generic parameter calls: useState<Type>(...) -> useState(...)
  code = code.replace(/(useState|useRef|useContext|useMemo|useCallback)<\s*[A-Za-z0-9_|\[\]\s]*\s*>/g, '$1');
  code = code.replace(/(satisfies|as)\s+[A-Za-z0-9_.[\]]+/g, '');

  // 7. Remove type annotations like `: string`, `: number`, `: any`, `: void` etc.
  // We list common TS type markers in this codebase
  const typesList = [
    'string', 'number', 'boolean', 'any', 'void', 'never',
    'HeaderProps', 'ProductFilter', 'Tier', 'LeadStatus', 'AnalyticsSummary',
    'BestSeller', 'AtRiskCustomer', 'RevenueByMonth', 'FaqWriteData', 'LeadWriteData',
    'EnquiryCreateData', 'LeadCreateData', 'CustomerUpdateData', 'CreateLoggedOrderInput',
    'OrderItemInput', 'SettingsData', 'SiteContentData', 'ProductWithRelations',
    'ProductWithRelations\\[\\]', 'CategoryWriteData', 'BrandWriteData', 'ProductWriteData',
    'ProductVariantInput', 'BestSeller\\[\\]', 'AtRiskCustomer\\[\\]', 'RevenueByMonth\\[\\]',
    'React\\.ReactNode', 'Prisma\\.ProductInclude', 'Prisma\\.ProductWhereInput', 'NextRequest',
    'NextResponse', 'Metadata', 'AuthState', 'CategoryWriteData\\b', 'BrandWriteData\\b',
    'ProductWriteData\\b', 'ProductVariantInput\\b'
  ];
  const typesPattern = new RegExp(`:\\s*(?:${typesList.join('|')})\\b`, 'g');
  code = code.replace(typesPattern, '');

  // Remove function return types like `: Promise<...>` or `: void`
  code = code.replace(/:\s*Promise<\s*[A-Za-z0-9_|[\]\s<>]*\s*>/g, '');
  
  // 8. Replace `<Image` with `<img`
  code = code.replace(/<Image/g, '<img');
  code = code.replace(/<\/Image>/g, '</img>');
  
  // 9. Links: `href=` -> `to=`
  code = code.replace(/<Link\s+href=/g, '<Link to=');
  code = code.replace(/<Link\s+([^>]*?)href=/g, '<Link $1to=');

  // 10. Next routers
  code = code.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate()');
  code = code.replace(/router\.push\(/g, 'navigate(');
  code = code.replace(/router\.replace\(/g, 'navigate(');
  code = code.replace(/const\s+pathname\s*=\s*usePathname\(\)/g, 'const { pathname } = useLocation()');

  return code;
}

// Walk through folder and transform files
function transformFolder(src, dest, extMap) {
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      // Skip generated prisma folders
      if (item === 'generated' || item === 'prisma') continue;
      const destPath = path.join(dest, item);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      transformFolder(srcPath, destPath, extMap);
    } else {
      const ext = path.extname(item);
      if (extMap[ext]) {
        const destItem = item.replace(ext, extMap[ext]);
        const destPath = path.join(dest, destItem);
        let content = fs.readFileSync(srcPath, 'utf8');
        content = stripTS(content);
        fs.writeFileSync(destPath, content, 'utf8');
      }
    }
  }
}

// Convert app pages to flat components in pages
const pagesMap = {
  '(marketing)/page.tsx': 'Home.jsx',
  '(marketing)/about/page.tsx': 'About.jsx',
  '(marketing)/brands/page.tsx': 'Brands.jsx',
  '(marketing)/brands/[slug]/page.tsx': 'BrandDetails.jsx',
  '(marketing)/contact/page.tsx': 'Contact.jsx',
  '(shop)/category/[slug]/page.tsx': 'CategoryDetails.jsx',
  '(shop)/products/page.tsx': 'Products.jsx',
  '(shop)/products/[slug]/page.tsx': 'ProductDetails.jsx',
  '(account)/account/page.tsx': 'AccountProfile.jsx',
  '(account)/account/orders/page.tsx': 'AccountOrders.jsx',
  '(account)/account/rewards/page.tsx': 'AccountRewards.jsx',
  '(admin)/admin/page.tsx': 'AdminDashboard.jsx',
  '(admin)/admin/analytics/page.tsx': 'AdminAnalytics.jsx',
  '(admin)/admin/brands/page.tsx': 'AdminBrands.jsx',
  '(admin)/admin/categories/page.tsx': 'AdminCategories.jsx',
  '(admin)/admin/chatbot/page.tsx': 'AdminChatbot.jsx',
  '(admin)/admin/content/page.tsx': 'AdminContent.jsx',
  '(admin)/admin/customers/page.tsx': 'AdminCustomers.jsx',
  '(admin)/admin/enquiries/page.tsx': 'AdminEnquiries.jsx',
  '(admin)/admin/leads/page.tsx': 'AdminLeads.jsx',
  '(admin)/admin/loyalty/page.tsx': 'AdminLoyalty.jsx',
  '(admin)/admin/orders/page.tsx': 'AdminOrders.jsx',
  '(admin)/admin/products/page.tsx': 'AdminProducts.jsx',
  '(admin)/admin/settings/page.tsx': 'AdminSettings.jsx'
};

function convertPages() {
  const pagesDest = path.join(srcDir, 'pages');
  for (const [relPath, destName] of Object.entries(pagesMap)) {
    const srcPath = path.join(appDir, relPath);
    if (!fs.existsSync(srcPath)) continue;

    let content = fs.readFileSync(srcPath, 'utf8');
    content = stripTS(content);

    // Convert App Router Page parameters: Props: { params: Promise<{ slug: string }> }
    // Convert to using React Router `useParams()` and wrapped in async page HOC
    
    // Find the default export function name
    const defaultExportMatch = content.match(/export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/);
    if (defaultExportMatch) {
      const funcName = defaultExportMatch[1];
      
      // Replace the export default async function line to just async function
      content = content.replace(/export\s+default\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/, 'async function $1');
      
      // Inject useParams import and createAsyncPage import at the top
      content = `import { useParams, useSearchParams } from 'react-router-dom';\nimport { createAsyncPage } from '@/lib/asyncPage';\n` + content;
      
      // Append the HOC wrapper export at the bottom
      content += `\nexport default createAsyncPage(${funcName});\n`;
    }

    fs.writeFileSync(path.join(pagesDest, destName), content, 'utf8');
  }
}

function main() {
  console.log('Initializing directory structure…');
  initDirectories();

  console.log('Transforming components folder…');
  transformFolder(componentsDir, path.join(srcDir, 'components'), { '.ts': '.js', '.tsx': '.jsx' });

  console.log('Transforming lib folder…');
  transformFolder(libDir, path.join(srcDir, 'lib'), { '.ts': '.js' });

  console.log('Converting pages folder…');
  convertPages();

  console.log('Conversion completed successfully.');
}

main();
