'use strict';

var apps = ['autogas', 'irrigation', 'mowers'];
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');

var copy = function (source, destination) {
  ncp(source, destination, function (err) {
    if (err) {
      return console.error(err);
    }
  });
};

var copyDestinations = function (source, destinations) {
  destinations.forEach(function (destination, i) {

    fs.stat(destination, function (err, stat) {

      mkdirp(destination, function (err) {
        if (err) {
          return console.error(err);
        }

        copy(source, destination);
      });
    });
  });
};

gulp.task('production', function() {
  return gulp.src('./_src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./www/autogas/assets/js'))
    .pipe(gulp.dest('./www/irrigation/assets/js'))
    .pipe(gulp.dest('./www/mowers/assets/js'))
    .pipe(gulp.dest('./autogas/www/assets/js'))
    .pipe(gulp.dest('./irrigation/www/assets/js'))
    .pipe(gulp.dest('./mowers/www/assets/js'));
});

gulp.task('sass', function () {
  return gulp.src('./_src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({
      outputStyle: 'compressed',
      indentedSyntax: false,
      precision: 8
    }))
    .pipe(gulp.dest('./www/autogas/assets/styles'))
    .pipe(gulp.dest('./www/irrigation/assets/styles'))
    .pipe(gulp.dest('./www/mowers/assets/styles'))
    .pipe(gulp.dest('./autogas/www/assets/styles'))
    .pipe(gulp.dest('./irrigation/www/assets/styles'))
    .pipe(gulp.dest('./mowers/www/assets/styles'));
});

gulp.task('js', function () {
  var source = './_src/js';

  apps.forEach(function (name, i) {
    var destinations = [
      path.join('./www', name, 'assets/js'),
      path.join('./', name, '/www/assets/js')
    ];

    copyDestinations(source, destinations);
  });
});

gulp.task('fonts', function () {
  var source = './_src/fonts';

  apps.forEach(function (name, i) {
    var destinations = [
      path.join('./www', name, 'assets/styles/fonts'),
      path.join('./', name, '/www/assets/styles/fonts')
    ];

    copyDestinations(source, destinations);
  });
});

gulp.task('webfonts', function () {
  var source = './_src/webfonts';

  apps.forEach(function (name, i) {
    var destinations = [
      path.join('./www', name, 'assets/styles/webfonts'),
      path.join('./', name, 'www/assets/styles/webfonts')
    ];

    copyDestinations(source, destinations);
  });
});

gulp.task('img', function () {
  apps.forEach(function (name, i) {
    var source = './_src/img/' + name;
    var destinations = [
      path.join('./www', name, 'assets/img'),
      path.join('./', name, '/www/assets/img')
    ];

    copyDestinations(source, destinations);
  });
});

gulp.task('html', function () {
  apps.forEach(function (name, i) {
    var source = path.join('./_src/html/', name, 'index.html');

    copy(source, path.join('./www', name, 'index.html'));
    copy(source, path.join('./', name, '/www/index.html'));
  });
});

gulp.task('remove-assets', function () {
  apps.forEach(function (name, i) {
    var source = './_src/img/' + name;

    exec( 'rm -Rf ' + path.join('./www', name, 'assets'));
    exec( 'rm -Rf ' + path.join('./', name, '/www/assets'));
  });
});

gulp.task('default', ['remove-assets', 'fonts', 'webfonts', 'img', 'sass', 'js']);

gulp.task('watch', ['remove-assets', 'fonts', 'webfonts', 'img', 'sass', 'js', 'html'], function () {
  gulp.watch('./_src/sass/**/*.sass', ['sass']);
  gulp.watch('./_src/js/**/*.js', ['js']);
  gulp.watch('./_src/html/**/*.html', ['html']);
});
