const fs = require('fs');
const path = require('path');

const dynContent = fs.readFileSync('frontend/src/components/DynamicLucideIcon.tsx', 'utf8');
const expMatch = dynContent.match(/export\s*\{([\s\S]*?)\};/);
const exported = expMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)).flat().filter(Boolean);

console.log('Currently exported count:', exported.length);

function checkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      checkDir(full);
    } else if (f.name.endsWith('.tsx') || f.name.endsWith('.ts')) {
      const code = fs.readFileSync(full, 'utf8');
      const regex = /import\s+(?:LucideIcon,\s*)?\{([\s\S]*?)\}\s*from\s*['"][^'"]*DynamicLucideIcon['"]/g;
      let m;
      while ((m = regex.exec(code)) !== null) {
        const named = m[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        for (const n of named) {
          if (!exported.includes(n)) {
            console.error('File:', full, 'imports MISSING export from DynamicLucideIcon:', n);
          }
        }
      }
    }
  }
}

checkDir('frontend/src');
console.log('Finished checking all frontend/src files.');

