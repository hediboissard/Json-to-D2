const fs = require('fs');
const path = require('path');

const dir = './schemas';
const schemas = {};

function quote(str) {
  // Supprime tous les caractères spéciaux problématiques
  return `"${str.replace(/[^a-zA-Z0-9_]/g, '_')}"`;
}

function loadSchemas() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    const json = JSON.parse(content);
    const name = json.title || path.basename(file, '.json');
    schemas[file] = { name, json };
  }
}

function extractRelations() {
  const lines = [];
  for (const [filename, { name, json }] of Object.entries(schemas)) {
    const nodeName = quote(name);
    if (json.type === 'object' && json.properties) {
      lines.push(`${nodeName}: {`);
      for (const [prop, val] of Object.entries(json.properties)) {
        const cleanProp = quote(prop);
        
        if (val.$ref) {
          const ref = path.basename(val.$ref);
          const refName = quote(schemas[ref]?.name || path.basename(ref, '.json'));
          lines.push(`  ${cleanProp}: ${refName}`);
          lines.push(`${nodeName} -> ${refName}`);
        } else if (val.type === 'array' && val.items?.$ref) {
          const ref = path.basename(val.items.$ref);
          const refName = quote(schemas[ref]?.name || path.basename(ref, '.json'));
          lines.push(`  ${cleanProp}: ${refName}`);  // Suppression des []
          lines.push(`${nodeName} -> ${refName}`);
        } else {
          lines.push(`  ${cleanProp}: ${val.type}`);
        }
      }
      lines.push(`}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

loadSchemas();
const output = extractRelations();
fs.writeFileSync('output.d2', output);
console.log('✅ Diagramme D2 généré dans output.d2');