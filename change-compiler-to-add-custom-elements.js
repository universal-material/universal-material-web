import fs from 'fs';

const compilerPath = 'node_modules/@angular/compiler/fesm2022/compiler.mjs';

fs.access(compilerPath, fs.constants.F_OK, fileDoesNotExists => {
  if (fileDoesNotExists) {
    return;
  }

  try {
    let content = fs.readFileSync(compilerPath).toString();

    if (content.includes('mapSchemas(SCHEMA);')) {
      return;
    }

    content = `${content}

import { mapSchemas } from '../../../../add-custom-elements-schemas.cjs';
mapSchemas(SCHEMA);`;

    fs.writeFileSync(compilerPath, content);
  } catch (err) {
    console.log(`An error occurred while changing Angular compiler to add custom elements`);
  }
});
