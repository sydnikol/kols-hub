const fs = require('fs');
const path = require('path');

// Read the current App.tsx
const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Extract all page imports
const importRegex = /^import\s+(\w+)\s+from\s+'\.\/pages\/([^']+)';$/gm;
const imports = [];
let match;

while ((match = importRegex.exec(content)) !== null) {
  imports.push({
    name: match[1],
    path: `./pages/${match[2]}`
  });
}

console.log(`Found ${imports.length} page imports to convert`);

// Remove old imports
content = content.replace(importRegex, '');

// Add lazy imports after the React import
const reactImportIndex = content.indexOf("import React");
const afterReactImport = content.indexOf('\n', reactImportIndex) + 1;

const lazyImports = imports.map(imp =>
  `const ${imp.name} = React.lazy(() => import('${imp.path}'));`
).join('\n');

content = content.slice(0, afterReactImport) + '\n// Lazy loaded pages\n' + lazyImports + '\n' + content.slice(afterReactImport);

// Write back
fs.writeFileSync(appPath, content);
console.log('Converted all imports to lazy loading!');
console.log('Remember to wrap Routes in <Suspense>');
