import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import mocha from 'gulp-mocha';
import bower from 'gulp-bower';
import runSequence from 'gulp-sequence';
import clean from 'gulp-rimraf';
import babel from 'gulp-babel';
import coverage from 'gulp-coverage';
import gulpConnect from 'gulp-connect';

// const tasks = ['eslint', 'sass', 'transpile', 'serve'];
const tasks = ['eslint', 'sass', 'transpile', 'test', 'serve'];

gulp.task('serve', ['sass', 'transpile'], () => {
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

gulp.task('eslint', () => {
  gulp.src(['gulpfile.babel.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.formatEach('compact', process.stderr))
    .pipe(eslint.failAfterError());
});

gulp.task('sass', () => {
  gulp.src('public/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});


gulp.task('test', ['transpile'], () => {
  gulp.src([
    './dist/test/game/game.js',
    './dist/test/user/model.js'
  ], {
    read: false
  }).pipe(mocha({
    timeout: 15000
  }));
});

gulp.task('eslint', () => {
  gulp.src(['public/js/**/*.js', 'test/**/*.js', 'app/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'dist/server.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    env: {
      PORT: 3000
    }
  });
});

gulp.task('bower', () => {
  bower({
    directory: 'public/lib'
  });
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
    '!dist/**/*',
    '!node_modules/**/*',
    '!eslintrc.json',
    '!bower.json',
  ], {
    base: './'
  })
    .pipe(gulp.dest('dist'));
});

gulp.task('transfer_jades', () => {
  gulp.src('app/views/**/*')
    .pipe(gulp.dest('dist/app/views'));
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
  // gulpConnect.reload();
});


gulp.task('test', ['transpile'], () => {
  gulp.src([
    './dist/test/game/game.js',
    './dist/test/user/model.js'
  ], {
    read: false
  })
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

gulp.task('transpile', runSequence('babelify', 'transfer_json', 'transfer_jades', 'transfer_libs'));
gulp.task('install', runSequence('bower', 'angular', 'angular-bootstrap', 'angularUtils', 'bootstrap', 'jquery', 'underscore', 'intro', 'angular-intro', 'angular-cookies', 'angular-unstable', 'font-awesome', 'angular-resource', 'emoji'));
gulp.task('default', runSequence('transpile'));
