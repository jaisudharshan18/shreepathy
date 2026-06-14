const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Strip import type ... statements (with or without semicolons)
  content = content.replace(/import type\s+[\s\S]*?;?\r?\n/g, '');
  content = content.replace(/import\s+\{\s*type\s+[\s\S]*?\}\s+from\s+.*?;?\r?\n/g, '');

  // 2. Strip combined type imports: e.g. import { cva, type VariantProps }
  content = content.replace(/,\s*type\s+[A-Za-z0-9_]+/g, '');
  content = content.replace(/type\s+[A-Za-z0-9_]+\s*,\s*/g, '');

  // 3. Strip type definitions
  content = content.replace(/(?:export\s+)?type\s+[A-Za-z0-9_]+\s*=\s*[\s\S]*?(?:;|\r?\n)/g, '');

  // 4. Strip interface definitions
  content = content.replace(/(?:export\s+)?interface\s+[A-Za-z0-9_]+\s*\{[\s\S]*?\r?\n\}/g, '');

  // 5. Strip variable type annotations: Record<...>
  content = content.replace(/:\s*Record\s*<[\s\S]*?>\s*=/g, ' =');

  // 6. Strip generic type params in useState/useRef:
  content = content.replace(/(useState|useRef|useContext|useMemo|useCallback)<\s*[A-Za-z0-9_|\[\]\s<>]*\s*>/g, '$1');

  // 7. Remove Next.js metadata and specific configuration exports
  content = content.replace(/export\s+const\s+dynamic\s*=\s*.*?;?\r?\n/g, '');
  content = content.replace(/export\s+const\s+metadata\s*=\s*[\s\S]*?;\r?\n/g, '');

  // 8. Strip Next.js generateMetadata and generateStaticParams functions
  content = content.replace(/export\s+async\s+function\s+generateMetadata\s*\([\s\S]*?\)\s*\{[\s\S]*?\r?\n\}/g, '');
  content = content.replace(/export\s+async\s+function\s+generateStaticParams\s*\([\s\S]*?\)\s*\{[\s\S]*?\r?\n\}/g, '');

  // 9. Fix function parameter type annotations like `({ params }: Props)`
  content = content.replace(/\(\{\s*params\s*\}\s*:\s*[A-Za-z0-9_|[\]\s<>{}:;]*\)/g, '({ params })');

  // 10. Clean destructured function parameter type annotations: e.g. `}: SelectPrimitive.Group.Props) {`
  content = content.replace(/\}:\s*[A-Za-z0-9_|[\]\s<>{}:;&!|'"?,.\-]*\s*\)\s*\{/g, '}) {');
  content = content.replace(/\}:\s*React\.ComponentProps\s*<\s*typeof\s+[A-Za-z0-9_.]+\s*>\s*\)\s*\{/g, '}) {');

  // 11. Remove Next.js notFound imports and clean calls
  content = content.replace(/import\s+\{\s*notFound\s*\}\s+from\s+['"]next\/navigation['"]\r?\n/g, '');
  
  // Replace: if (!x) notFound() or if (!x) { notFound() } with return Not Found view
  content = content.replace(/if\s*\(\s*!([a-zA-Z0-9_]+)\s*\)\s*\{\s*notFound\(\);?\s*\}/g, 'if (!$1) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;');
  content = content.replace(/if\s*\(\s*!([a-zA-Z0-9_]+)\s*\)\s*notFound\(\);?/g, 'if (!$1) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;');

  // 12. Fix the broken `order order & { customer: unknown }` to just `order`
  content = content.replace(/order\s+order\s+&\s+\{\s*customer:\s*unknown\s*\}/g, 'order');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(item);
      if (ext === '.js' || ext === '.jsx') {
        cleanFile(fullPath);
      }
    }
  }
}

console.log('Cleaning up types and Next remnants in src/…');
walk(srcDir);
console.log('Cleanup completed.');
