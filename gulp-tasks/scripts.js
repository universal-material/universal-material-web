import gulp from 'gulp';
import changed from 'gulp-changed';
import gulpSass from 'gulp-sass';
import ts from 'gulp-typescript';
import * as dartSass from 'sass';
import through2 from 'through2';

const tsProject = ts.createProject('tsconfig.json');

const scriptDest = './dist';
const buildScripts = () =>
  tsProject
    .src()
    .pipe(changed(scriptDest, {extension: 'js'}))
    .pipe(tsProject())
    .pipe(gulp.dest(scriptDest));

const sass = gulpSass(dartSass);

const options = {cwd: 'src'};

const sassToTsDest = 'src';
const sassToTs = () =>
  gulp
    .src('**/*.styles.scss', options)
    .pipe(changed(sassToTsDest, {extension: 'ts'}))
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
    .pipe(gulp.dest(sassToTsDest));

const allInSeries = gulp.series(sassToTs, buildScripts);

const watch = () =>
  gulp.watch(['**/*.scss', '**/*.ts'], options, allInSeries);

gulp.task('scripts:build', buildScripts);
gulp.task('scripts:sass-to-ts', sassToTs);
gulp.task('scripts:watch', gulp.series(allInSeries, watch));
