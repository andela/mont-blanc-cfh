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

gulp.task('bs-reload', () => {
  browserSync.reload();
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

gulp.task('watch', () => {
  gulp.watch(['app/views/**', 'public/views/**'], ['bs-reload']);
  gulp.watch(['public/js/**', 'app/**/*.js'], ['eslint', 'bs-reload']);
  gulp.watch(['public/css/common.scss, public/css/views/articles.scss'], ['sass']);
  gulp.watch(['public/css/**'], ['sass', 'bs-reload']);
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


gulp.task('clean', () => {
  gulp.src('public/lib')
    .pipe(clean({
      force: true
    }));
});

gulp.task('transfer_jades', () => {
  gulp.src('app/views/**/*')
    .pipe(gulp.dest('dist/app/views'));
});

gulp.task('transfer_libs', () => {
  gulp.src(['public/**/*', '!public/js/**'])
    .pipe(gulp.dest('dist/public'));
});
gulp.task('transfer_json', () => {
  gulp.src('config/env/**/*.json')
    .pipe(gulp.dest('dist/config/env'));
});


gulp.task('babelify', () => {
  gulp.src(['./**/*.js', '!dist/**', '!node_modules/**', '!bower_components/**', '!public/lib/**'])
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('transpile', runSequence('babelify', 'transfer_json', 'transfer_jades', 'transfer_libs'));
gulp.task('install', runSequence('bower', 'angular', 'angular-bootstrap', 'angularUtils', 'bootstrap', 'jquery', 'underscore', 'intro', 'angular-intro', 'angular-cookies', 'angular-unstable', 'font-awesome', 'angular-resource', 'emoji'));
gulp.task('default', runSequence('transpile'));
