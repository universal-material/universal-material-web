import gulp from 'gulp';
import notify from 'gulp-notify';
import gulpPug from 'gulp-pug';
import gulpSass from 'gulp-sass';
import { encode } from 'html-entities';
import fs from 'node:fs';
import { rollup } from 'rollup';
import * as dartSass from 'sass';
import { Project } from 'ts-morph';

const sass = gulpSass(dartSass);

import rollupConfig from '../rollup.config.js';
import { setClassInfo } from './docs-api.js';

const distCssPath = 'docs/dist/css';

const buildPug = () => {
  return gulp
    .src(["./docs/src/**/*.pug", "!./docs/src/_*.pug"])
    .pipe(gulpPug({
      data: {
        debug: true,
        version:
          "<%= pkg.version + '.' + pkg.build %>"
      },
      filters: {
        exampleCode: text =>
          `
<u-card-content>${text}</u-card-content>
<u-card-content class="example-card-code" slot="after-content">
  <pre><code class="language-html">${encode(text, {level: 'html5'})}</code></pre>
</u-card-content>`,
        escape: text =>
          encode(text, {level: 'html5'})
      },
      doctype: 'html',
      pretty: true
    }).on("error", notify.onError(function(error) {
      return "An error occurred while compiling pug.\nLook in the console for details.\n" + error;
    })))
    .pipe(gulp.dest("./docs/dist")); // tell gulp our output folder
}

const copyJs = () =>
  gulp
    .src("./dist/**/*.js")
    .pipe(gulp.dest('docs/dist/js'));

const copyCss = () =>
  gulp
    .src("./dist/css/**/*.css")
    .pipe(gulp.dest(distCssPath));

const createJsBundle = async () => {
  const bundle = await rollup(rollupConfig);
  await bundle.write({
    file: './docs/dist/js/index.js'
  })
}

const watch = () => {
  gulp.watch(['src/**/*.pug', 'src/**/*.html'], {cwd: 'docs'}, buildPug);
  gulp.watch('css/*.scss', {cwd: 'docs'}, buildSass);
  gulp.watch('**/*.js', {cwd: 'dist'}, copyJs);
  gulp.watch('**/*.css', {cwd: 'dist'}, copyCss);
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

  fs.writeFile('./docs/src/_apis.pug', `- var apis = ${JSON.stringify(apis)}`, err => {
    if (err) {
      console.error(err);
      cb(err);
      return;
    }

    cb()
    console.log('Done.');
  });
};

const buildSass = () =>
  gulp
    .src('docs/src/css/docs.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(distCssPath));

gulp.task('docs', gulp.series(buildPugApis, gulp.parallel(buildPug, createJsBundle)));
gulp.task('docs:pug:apis', buildPugApis);
gulp.task('docs:pug', buildPug);
gulp.task('docs:js', copyJs);
gulp.task('docs:css', copyCss);
gulp.task('docs:scss', buildSass);
gulp.task('docs:bundle', createJsBundle);
gulp.task('docs:watch', gulp.series(buildPugApis, gulp.parallel(buildPug, copyJs, copyCss, buildSass), watch));
