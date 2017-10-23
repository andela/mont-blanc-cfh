const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpLivereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const babel = require('gulp-babel');
const coverage = require('gulp-coverage');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const gulpConnect = require('gulp-connect');

const tasks = ['eslint', 'sass', 'transpile', 'serve', 'watch'];

gulp.task('serve', () => {
  nodemon({
    watch: ['./dist', './app', './public'],
    script: 'dist/server.js',
    ext: 'js html jade',
    ignore: ['dist/config', 'node_modules/**'],
    env: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('watch', () => {
  gulpLivereload.listen();
  gulp.watch('./public/**/*.scss', ['sass']);
  gulp.watch('./public/**/*.html', ['transpile']);
  gulp.watch('./public/**/*.css');
  gulp.watch('./public/**/*.js', ['eslint', 'transpile']);
});

gulp.task('connect', () => {
  gulpConnect.server({
    root: ['dist'],
    port: 8000,
    livereload: true,
  });
});

gulp.task('html', () => {
  gulp.src('./public/**/*.html')
    .pipe(gulpConnect.reload());
});

gulp.task('eslint', () => {
  gulp.src(['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', () => {
  gulp.src('./public/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'));
});

gulp.task('bower', () => {
  bower({ directory: 'public/lib' });
});

gulp.task('public', () => {
  gulp.src([
    './public/**/*',
    './css/**/*',
    'public/views/**/*',
    'app/views/**/*',
    './**/*.json',
    '!package.json',
    '!public/js/**/*',
    '!node_modules/**/*',
    '!eslintrc.json',
    '!bower.json',
  ], { base: './' })
    .pipe(gulp.dest('dist'));
});


gulp.task('transpile', ['public'], () => {
  gulp.src([
    './**/*.js',
    '!dist/**',
    '!node_modules/**',
    '!public/lib/**',
    '!gulpfile.babel.js'
  ])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
  gulpConnect.reload();
});


gulp.task('test', () => {
  gulp.src(
    [
      './test/game/game.js',
      './test/user/model.js'
    ],
    { read: false }
  )
    .pipe(coverage.instrument({
      pattern: ['**/test*'],
      debugDirectory: 'debug'
    }))
    .pipe(mocha({
      timeout: 15000
    }))
    .pipe(coverage.gather())
    .pipe(coverage.format())
    .pipe(gulp.dest('reports'));
});

gulp.task('default', tasks);
