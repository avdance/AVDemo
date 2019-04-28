const gulp = require('gulp');
const babel = require('babel');
const browserify = require('browserify');

gulp.task('js-min', (done)=>{
    gulp.src('./lib/*.js').
    pipe(babel()).
    pipe(browserify()).
    pipe(gulp.dest('dest'))
});

gulp.task('default', gulp.series('js-min'));
