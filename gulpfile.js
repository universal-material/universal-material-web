import gulp from 'gulp';
import notify from 'gulp-notify';
import gulpPug from 'gulp-pug';
import gulpSass from 'gulp-sass';
import { encode } from 'html-entities';
import * as fs from 'node:fs';
import * as dartSass from 'sass';
import through2 from 'through2';
import { Project, SyntaxKind } from 'ts-morph';

const sass = gulpSass(dartSass);

const pugDocs = () => {
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

const docsCopyJs = () =>
  gulp
    .src(["./dist/**/*"])
    .pipe(gulp.dest('docs/dist/js'));

const watchDocs = () => {
  gulp.watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], pugDocs);
  gulp.watch(['./dist/**/*'], docsCopyJs);
  gulp.watch(['src/**/*.ts'], docsPugApis);
}

const docsPugApis = cb => {

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
      const apiName = `${className[0].toLowerCase()}${className.slice(1)}`;
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

const sassToTs = () =>
  gulp
    .src(['./src/**/*.scss', '!./src/styles/**/*.scss'])
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(through2({objectMode: true}, (file, enc, cb) => {
      let content = file.contents.toString();
      content = content.replaceAll(/^(.)/gm, '  $1');

      const newContent = `import { css } from 'lit';

export const styles = css \`
${content}
\`;
`

      file.contents = new Buffer(newContent);
      file.path = file.path.replace('.css', '.ts')
      return cb(null, file);
    }))
    .pipe(gulp.dest('./src'));

gulp.task('docs:pug:apis', docsPugApis);
gulp.task('docs:pug', pugDocs);
gulp.task('docs:js', docsCopyJs);
gulp.task('docs:watch', watchDocs);

gulp.task('sass:sass-to-ts', sassToTs);
gulp.task('sass:sass-to-ts:watch', () => gulp.watch('./src/**/*.scss', sassToTs));

function setClassInfo(classDeclaration, classInfo) {

  if (!classDeclaration || classDeclaration.getSourceFile().getFilePath().includes('node_modules')) {
    return;
  }

  for (const property of classDeclaration.getProperties()) {

    if (property.isStatic() || property.hasModifier(SyntaxKind.PrivateKeyword) || property.hasModifier(SyntaxKind.ProtectedKeyword)) {
      continue;
    }

    const description = property.getJsDocs()[0]?.getDescription();

    const typeText = property.getType().getText();

    classInfo.push({
      type: typeText.includes('|')
        ? 'string'
        : typeText,
      attribute: property.getDecorator('property')
        ? property
          .getName()
          .split(/(?=[A-Z])/)
          .join('-')
          .toLowerCase()
        : null,
      default: property.getInitializer()?.getText() ?? 'undefined',
      name: property.getName(),
      description: description
        ?.replaceAll(/`(.+?)`/g, '<code>$1</code>')
    });
  }

  setClassInfo(classDeclaration.getBaseClass(), classInfo);
}

// exports.default = gulp.parallel(
//   exports['sass'],
//   exports['scripts'],
//   exports['pug:docs'],
//   exports['sass:docs'],
//   exports['watch'])

gulp.task('docs', gulp.series(docsPugApis, gulp.parallel('docs:pug', pugDocs, docsCopyJs, watchDocs)));
// exports.docs = gulp.parallel(
//   exports['docs:pug'],
//   exports['docs:js'],
//   exports['docs:watch'])
