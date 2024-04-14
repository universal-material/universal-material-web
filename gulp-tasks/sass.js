import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import * as dartSass from 'sass';
import through2 from 'through2';

const sass = gulpSass(dartSass);

const buildSassBase = minify => {
  let pipeline = gulp
    .src('./src/scss/universal-material.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: minify ? 'compressed' : 'expanded'}).on('error', sass.logError));

  if (minify) {
    pipeline = pipeline.pipe(rename({suffix: '.min'}))
  }

  return pipeline
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
};

const buildSassExpanded = () => buildSassBase(false);
const buildSassMin = () => buildSassBase(true);
const buildSass = gulp.parallel(buildSassExpanded, buildSassMin);

const sassToTsSrc = ['./src/**/*.scss', '!./src/scss/**/*.scss'];
const sassToTs = () =>
  gulp
    .src(sassToTsSrc)
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

const watch = () => gulp.watch('./scss/styles/**/*.scss', buildSass);

const watchSassToTs = () =>
  gulp.watch(sassToTsSrc, sassToTs)

gulp.task('sass', buildSass);
gulp.task('sass:watch', gulp.series(buildSass, watch));
gulp.task('sass-to-ts', sassToTs);
gulp.task('sass-to-ts:watch', watchSassToTs);
