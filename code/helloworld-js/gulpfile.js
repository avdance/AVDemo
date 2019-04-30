const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const browserfiy = require('browserify');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


gulp.task('clean', (done)=>{
    console.log('clean ... ');
    gulp.src('build', {read:false})
    .pipe(clean());
    done();
});

gulp.task('lint', ()=>{
    console.log('js lint ...');
     return gulp.src('lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('babel', ()=>{
    console.log('js babel ...');
    return gulp.src('lib/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/lib-es5'));   
});

gulp.task('bundle', (done) =>{
    console.log('browserify...');
    
    browserfiy({
        entries      : './build/lib-es5/index.js',
        extensions   : [ '.js' ],
        standalone: 'helloworld',
        debug        : false,
		// Required for watchify (not used here).
		cache        : null,
		// Required for watchify (not used here).
		packageCache : null,
		// Required to be true only for watchify (not used here).
		fullPaths    : false
    })
    .bundle()
    .pipe(source('helloworld-min.js'))
    .pipe(buffer())
    .pipe(rename('helloworld-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'));

    done();
});


gulp.task('default', gulp.series('lint', 'babel', 'bundle'));
