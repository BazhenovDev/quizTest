'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

function defaultTask() {
    return gulp.src('./src/styles/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/styles'));
}


exports.default = defaultTask

exports.watch = function () {
    gulp.watch('./src/**/*.scss', gulp.series('default'));
};