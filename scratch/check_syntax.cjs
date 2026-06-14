const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const srcDir = path.resolve(__dirname, '../src');
const errors = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    esbuild.transformSync(content, {
      loader: filePath.endsWith('.jsx') ? 'jsx' : 'js',
      format: 'esm',
      minify: false,
    });
  } catch (err) {
    errors.push({
      file: path.relative(path.resolve(__dirname, '..'), filePath),
      error: err.message,
    });
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
        checkFile(fullPath);
      }
    }
  }
}

console.log('Checking syntax in src/...');
walk(srcDir);

if (errors.length > 0) {
  console.log(`\nFound ${errors.length} files with syntax errors:\n`);
  errors.forEach(e => {
    console.log(`--- ${e.file} ---`);
    console.log(e.error);
    console.log();
  });
} else {
  console.log('\nAll files compiled successfully with esbuild.');
}
