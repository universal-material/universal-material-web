import fs from 'fs';

const path = './dist/package.json';

const content = fs.readFileSync(path, 'utf8');

const newContent = content.replaceAll(/,\n\s+"(postinstall|publish)":\s".+?"/g, '');

fs.writeFileSync(path, newContent);
