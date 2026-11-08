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
      // match: import ... from '...DynamicLucideIcon';
      const importLines = code.split(';').map(s => s.trim());
      for (const stmt of importLines) {
        if (stmt.includes('DynamicLucideIcon') && stmt.startsWith('import')) {
          const m = stmt.match(/import\s+(?:(?:type\s+)?[\w\s,]+,\s*)?\{([\s\S]*?)\}\s*from/);
          if (m) {
            const named = m[1].split(',').map(s => s.trim()).filter(Boolean);
            for (const n of named) {
              if (!exported.includes(n)) {
                console.log('ACTUAL MISSING EXPORT:', n, 'in', full);
              }
            }
          }
        }
      }
    }
  }
}

checkDir('frontend/src');
console.log('Done check.');

