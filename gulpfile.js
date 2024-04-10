import gulp from 'gulp';
import notify from 'gulp-notify';
import gulpPug from 'gulp-pug';
import gulpSass from 'gulp-sass';
import { encode } from 'html-entities';
import * as fs from 'node:fs';
import { rollup } from 'rollup';
import * as dartSass from 'sass';
import through2 from 'through2';
import { Project, SyntaxKind } from 'ts-morph';

import rollupConfig from './rollup.config.js';

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

const docsBundle = async () => {
  const bundle = await rollup(rollupConfig);
  await bundle.write({
    file: './docs/dist/js/index.js'
  })
}

const watchDocs = () => {
  gulp.watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], pugDocs);
  gulp.watch(['./dist/**/*'], docsCopyJs);
  gulp.watch(['./src/**/*.ts', '!./src/**/*.styles.ts'], docsPugApis);
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

function getAttributeName(property) {
  const decorators = property.getDecorators();
  const propertyDecorator = decorators.find(d => d.getName() === 'property');

  if (!propertyDecorator) {
    return null;
  }

  const optionsArgument = propertyDecorator.getArguments()[0];

  if (!optionsArgument) {
    return property.getName();
  }

  return optionsArgument.getProperty('attribute')
    ?.getInitializer()
    ?.getText()
    ?.replaceAll(`'`, '') ?? property.getName();
}

function getJsDocsDescription(property) {
  const jsDocs = property.getJsDocs()[0];

  if (!jsDocs) {
    return null;
  }

  let description = encode(jsDocs.getDescription())
    .replaceAll(/`(.+?)`/g, '<code>$1</code>')
    .replaceAll(/_(.+?)_/g, '<em>$1</em>')
    .trimStart();

  const linkTag = jsDocs
    .getTags()
    .find(t => t.getTagName() === 'link');

  if (!linkTag) {
    return description;
  }

  const link = linkTag.getComment().trim();

  return `${description}

<a href="${link}" target="_blank">${link}</a>`;
}

function setClassInfo(classDeclaration, classInfo) {

  if (!classDeclaration || classDeclaration.getSourceFile().getFilePath().includes('node_modules')) {
    return;
  }

  for (const property of classDeclaration.getProperties().concat(classDeclaration.getGetAccessors())) {

    const propertyName = property.getName();

    if (property.isStatic()
      || property.hasModifier(SyntaxKind.PrivateKeyword)
      || property.hasModifier(SyntaxKind.ProtectedKeyword)
      || propertyName.startsWith('#')) {
      continue;
    }

    const attributeName = getAttributeName(property);

    const description = getJsDocsDescription(property);
    const typeText = property.getType().getText();

    classInfo.push({
      type: typeText.includes('|')
        ? 'string'
        : typeText,
      attribute: attributeName,
      default: property.getInitializer
        ? property.getInitializer()?.getText() ?? 'undefined'
        : null,
      name: propertyName.startsWith('_')
        ? null
        : propertyName,
      description: description
    });
  }

  setClassInfo(classDeclaration.getBaseClass(), classInfo);
}

gulp.task('docs:pug:apis', docsPugApis);
gulp.task('docs:pug', pugDocs);
gulp.task('docs:js', docsCopyJs);
gulp.task('docs:bundle', docsBundle);
gulp.task('docs:watch', gulp.series(docsPugApis, gulp.parallel(pugDocs, docsCopyJs, watchDocs)));

gulp.task('sass:sass-to-ts', sassToTs);
gulp.task('sass:sass-to-ts:watch', () => gulp.watch('./src/**/*.scss', sassToTs));

gulp.task('docs', gulp.series(docsPugApis, gulp.parallel(pugDocs, docsBundle)));
