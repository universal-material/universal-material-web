const gulp = require('gulp');

const notify = require('gulp-notify');

const gulpPug = require('gulp-pug');

const pugDocs = () => {
  return gulp
    .src(["./docs/src/**/*.pug", "!./docs/src/layout.pug"])
    .pipe(gulpPug({
      data: {
        debug: true,
        version:
          "<%= pkg.version + '.' + pkg.build %>"
      },
      doctype: 'html',
      pretty: true
    }).on("error", notify.onError(function (error) {
      return "An error occurred while compiling pug.\nLook in the console for details.\n" + error;
    })))
    .pipe(gulp.dest("./docs/dist")); // tell gulp our output folder
}

const docsCopyJs = () =>
  gulp
    .src(["./dist/**/*"])
    .pipe(gulp.dest('docs/dist/js'));

const watchDocs = () => {
  gulp.watch(['./docs/src/**/*.pug', './docs/src/**/*.html'], exports['docs:pug']);
  gulp.watch(['./dist/**/*'], exports['docs:js']);
}

exports['docs:pug'] = pugDocs;
exports['docs:js'] = docsCopyJs;
exports['docs:watch'] = watchDocs;

// exports.default = gulp.parallel(
//   exports['sass'],
//   exports['scripts'],
//   exports['pug:docs'],
//   exports['sass:docs'],
//   exports['watch'])

exports.docs = gulp.parallel(
  exports['docs:pug'],
  exports['docs:js'],
  exports['docs:watch'])
