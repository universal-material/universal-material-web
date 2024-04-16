import fs from 'fs';

const componentSchematicFilesFolderPath = 'node_modules/@schematics/angular/component/files/__name@dasherize@if-flat__';
const htmlSchematicPath = `${componentSchematicFilesFolderPath}/__name@dasherize__.__type@dasherize__.html.template`;
const pugSchematicPath = `${componentSchematicFilesFolderPath}/__name@dasherize__.__type@dasherize__.pug.template`;
const tsSchematicPath = `${componentSchematicFilesFolderPath}/__name@dasherize__.__type@dasherize__.ts.template`;

fs.access(htmlSchematicPath, fs.constants.F_OK, fileDoesNotExists => {
  if (fileDoesNotExists) {
    return;
  }

  try {
    fs.renameSync(htmlSchematicPath, pugSchematicPath);
    let pugFile = fs.readFileSync(pugSchematicPath).toString();
    pugFile = pugFile
      .replace('<p>', 'p ')
      .replace('</p>', '');

    fs.writeFileSync(pugSchematicPath, pugFile);


    let tsFile = fs.readFileSync(tsSchematicPath).toString();

    tsFile = tsFile
      .replace('.html', '.pug');

    fs.writeFileSync(tsSchematicPath, tsFile);
  } catch (err) {
    console.log(`An error occurred while changing Angular CLI's schematics`);
  }
});
