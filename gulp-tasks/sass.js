import gulp from 'gulp';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import * as dartSass from 'sass';

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

const watch = () => gulp.watch('./scss/styles/**/*.scss', buildSass);

gulp.task('sass', buildSass);
gulp.task('sass:watch', gulp.series(buildSass, watch));
