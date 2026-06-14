const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.resolve(__dirname, '../src');

function cleanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const loader = filePath.endsWith('.jsx') ? 'tsx' : 'ts';
  try {
    const result = esbuild.transformSync(content, {
      loader: loader,
      charset: 'utf8',
      minify: false,
    });
    
    // Write back the transpiled clean Javascript
    fs.writeFileSync(filePath, result.code, 'utf8');
    console.log(`Successfully cleaned: ${path.relative(srcDir, filePath)}`);
  } catch (err) {
    console.error(`Failed to clean ${path.relative(srcDir, filePath)}:`, err.message);
  }
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

console.log('Stating in-place type stripping of all files in src/ using esbuild...');
walk(srcDir);
console.log('Type stripping completed.');
