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

    mkdirp(destination, function (err) {
      if (err) {
        return console.error(err);
      }

      copy(source, destination);
    });
  });
};

gulp.task('production', ['default'], function() {
  apps.forEach(function (name, i) {
    gulp.src(path.join('./', name, '/www/assets/js/**/*.js'))
      .pipe(uglify())
      .pipe(gulp.dest(path.join('./', name, '/www/assets/js')));
  });

  // return gulp.src('./_src/js/**/*.js')
  //   .pipe(uglify())
    // .pipe(gulp.dest('./www/autogas/assets/js'))
    // .pipe(gulp.dest('./www/irrigation/assets/js'))
    // .pipe(gulp.dest('./www/mowers/assets/js'))
    // .pipe(gulp.dest('./autogas/www/assets/js'))
    // .pipe(gulp.dest('./irrigation/www/assets/js'))
    // .pipe(gulp.dest('./mowers/www/assets/js'));
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
  var js = './_src/js';

  apps.forEach(function (name, i) {
    var destinations = [
      path.join('./www', name, 'assets/js'),
      path.join('./', name, '/www/assets/js')
    ];

    destinations.forEach(function (destination, j) {
      mkdirp(path.join(destination, 'vendor'), function () {
        copy(path.join(js, 'vendor'), path.join(destination, 'vendor'));
      });

      // gulp.src(path.join(js, 'index.js')).pipe(gulp.dest(path.join(destination, 'index.js')));
      // gulp.src(path.join(js, 'main.js')).pipe(gulp.dest(path.join(destination, 'main.js')));
      // gulp.src(path.join(js, 'app', 'app.js')).pipe(gulp.dest(path.join(destination, 'app', 'app.js')));
      // gulp.src(path.join(js, 'app', 'config.js')).pipe(gulp.dest(path.join(destination, 'app', 'config.js')));
      // gulp.src(path.join(js, 'sliders', name + '.js')).pipe(gulp.dest(path.join(destination, 'app', 'sliders.js')));
      // gulp.src(path.join(js, 'calculators', name + '.js')).pipe(gulp.dest(path.join(destination, 'app', 'calculator.js')));

      mkdirp(path.join(destination, 'app'), function () {
        copy(path.join(js, 'index.js'), path.join(destination, 'index.js'));
        copy(path.join(js, 'main.js'), path.join(destination, 'main.js'));
        copy(path.join(js, 'app', 'app.js'), path.join(destination, 'app', 'app.js'));
        copy(path.join(js, 'app', 'config.js'), path.join(destination, 'app', 'config.js'));
        copy(path.join(js, 'app', 'sliders', name + '.js'), path.join(destination, 'app', 'sliders.js'));
        copy(path.join(js, 'app', 'calculators', name + '.js'), path.join(destination, 'app', 'calculator.js'));
      });
    });
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
    var source = path.join('./_src/html/', name + '.html');

    copy(source, path.join('./www', name, 'index.html'));
    copy(source, path.join('./', name, '/www/index.html'));
  });
});

gulp.task('remove-assets', function () {
  apps.forEach(function (name, i) {
    exec( 'rm -Rf ' + path.join('./www', name, 'assets'));
    exec( 'rm -Rf ' + path.join('./', name, '/www/assets'));
  });
});

gulp.task('default', ['remove-assets', 'img', 'sass', 'js', 'fonts', 'webfonts']);

gulp.task('watch', ['remove-assets', 'fonts', 'webfonts', 'img', 'sass', 'js', 'html'], function () {
  gulp.watch('./_src/sass/**/*.sass', ['sass']);
  gulp.watch('./_src/js/**/*.js', ['js']);
  gulp.watch('./_src/html/**/*.html', ['html']);
});
