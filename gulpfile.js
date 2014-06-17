// Dependencies
var gulp = require('gulp');
var fs = require('fs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var combine = require('stream-combiner');
var rename = require('gulp-rename');

// Path variables
var paths = {
  jsSrc: './src/',
  jsSrcAll: './src/**/*.js'
};

// Some vars we'll use
var now = new Date();
var pkg = require('./package.json');

// Banner vars
var bannerVars = {
  version: pkg.version,
  date: now.getDay() + '.' + now.getMonth() + '.' + now.getFullYear(),
  year: now.getFullYear()
};

var watchLogger = function(event) {
  console.log('File ' + event.path + ' was ' + event.type + '...');
};

var errorLogger = function(error) {
  console.warn(error.message);
};

/**
 * DEFAULT TASK
 * Does all the tasks initially, then watches files for changes.
 */
gulp.task('default', [
  'scripts',
  'watch'
]);

/**
 * SCRIPTS (DIST)
 */
gulp.task('scripts', function () {

  var combined = combine(

    // App js
    gulp.src([
      paths.jsSrc + '/easter-egg.js'
    ]),
    concat('easter-egg.js'),
    header(fs.readFileSync('banner.txt', 'utf-8'), { vars: bannerVars }),
    gulp.dest('./dist'),
    uglify({ preserveComments: 'some' }),
    rename('easter-egg.min.js'),
    gulp.dest('./dist')
  );

  combined.on('error', errorLogger);

  return combined;

});

/**
 * WATCH JS SOURCES
 */
gulp.task('watch', function () {

  gulp.watch(paths.jsSrcAll, ['scripts'])
    .on('change', watchLogger);

});

