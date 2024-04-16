import gulp from 'gulp';
import fs from 'node:fs';
import { Project } from 'ts-morph';

import { setClassInfo } from './docs-api.js';

const watch = () => {
  gulp.watch(['**/*.ts', '!**/*.styles.ts'], {cwd: 'src'}, buildPugApis);
}

const buildPugApis = cb => {

  console.log('Generating APIs model....');

  const project = new Project();
  project.addSourceFilesAtPaths('src/**/*.ts');

  const apis = {};

  for (const sourceFile of project.getSourceFiles()) {

    if (sourceFile.getFilePath().includes('node_modules')) {
      continue;
    }

    for (const classDeclaration of sourceFile.getClasses()) {

      if (classDeclaration.isAbstract()) {
        continue;
      }

      const classInfo = [];

      setClassInfo(classDeclaration, classInfo);

      if (!classInfo.length) {
        continue;
      }

      const className = classDeclaration.getName();
      const apiName = `${className[2].toLowerCase()}${className.slice(3)}`;
      apis[apiName] = classInfo;
    }
  }

  fs.writeFile('./docs/src/app/apis.ts', `export const Apis = ${JSON.stringify(apis, null, 2)}`, err => {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb()
    console.log('Done.');
  });
};

gulp.task('docs:apis', buildPugApis);
gulp.task('docs:apis:watch', watch);
