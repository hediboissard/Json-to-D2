const fs = require('fs');
const path = require('path');

const dir = './schemas';
const schemas = {};

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
    if (json.type === 'object' && json.properties) {
      lines.push(`${name}: {`);
      for (const [prop, val] of Object.entries(json.properties)) {
        if (val.$ref) {
          const ref = val.$ref;
          const refName = schemas[ref]?.name || path.basename(ref, '.json');
          const type = val.type === 'array' ? `${refName}[]` : refName;
          lines.push(`  ${prop}: ${type}`);
          lines.push(`${name} -> ${refName}`);
        } else if (val.type === 'array' && val.items?.$ref) {
          const ref = val.items.$ref;
          const refName = schemas[ref]?.name || path.basename(ref, '.json');
          lines.push(`  ${prop}: ${refName}[]`);
          lines.push(`${name} -> ${refName}`);
        } else {
          lines.push(`  ${prop}: ${val.type}`);
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
console.log('Diagramme D2 généré dans output.d2');
