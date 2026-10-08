// Inlines the SVGs into the spec page. Usage: node build-page.js -> ../index.html
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(__dirname, 'page.template.html'), 'utf8');
html = html.replace(/\{\{([\w-]+)\}\}/g, (_, name) =>
  fs.readFileSync(path.join(dir, 'svg', `${name}.svg`), 'utf8').replace(/ width="\d+" height="\d+"/, ''));
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('wrote index.html', html.length, 'bytes');
