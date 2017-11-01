// Import neccessary libaries
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const mocha = require('gulp-mocha');
const bower = require('gulp-bower');
const runSequence = require('gulp-sequence');
const clean = require('gulp-rimraf');
const babel = require('gulp-babel');

const tasks = ['eslint', 'sass', 'transpile', 'test', 'serve'];

//  lint files in public, test and app folders
gulp.task('eslint', () => {
  gulp.src(['public/js/**/*.js', 'test/**/*.js', 'app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failOnError());
});

// Pipe sass through gulp-sass, convert to css and drop files in dist folder
gulp.task('sass', () => {
  gulp.src('public/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});


// Transpile js files, transfer json files, jade and generated lib files
gulp.task('transpile-test', ['babelify', 'transfer_json', 'transfer_jades', 'transfer_libs']);


// Transpile test and generate report
gulp.task('test', () => {
  gulp.src(['dist/test/**/*.js'], {
    read: false
  })
    .pipe(mocha({
      reporter: 'spec'
    }));
  // .once('error', () => {
  //   process.exit(1);
  // })
  // .once('end', () => {
  //   process.exit();
  // });
});

//  Watch files for changes
gulp.task('watch', () => {
  gulp.watch('./public/**/*.scss', ['sass']);
  gulp.watch('./public/**/*.html', ['transpile']);
  gulp.watch('./public/**/*.css');
  gulp.watch('./public/**/*.js', ['eslint', 'transpile']);
});

// Start server.js on port 3000 and ignore listed files
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

//  Specify directory for bower generated libraries
gulp.task('bower', () => {
  bower({
    directory: 'dist/public/lib'
  });
});

//  Clean the generated folder
gulp.task('clean', () => {
  gulp.src('./public/lib')
    .pipe(clean({
      force: true
    }));
});

//  Move JSON files config to dis/config
gulp.task('transfer_json', () => {
  gulp.src('config/env/**/*.json')
    .pipe(gulp.dest('dist/config/env'));
});

// Move jade files app/views to dist/app/views
gulp.task('transfer_jades', () => {
  gulp.src('app/views/**/*')
    .pipe(gulp.dest('dist/app/views'));
});

// Move generated libraries public folder to dest/public
gulp.task('transfer_libs', () => {
  gulp.src(['public/**/*', '!public/js/**'])
    .pipe(gulp.dest('dist/public'));
});

// Pass all js files through gulp-babel and transpile using es2015 preset
gulp.task('babelify', () => {
  gulp.src(['./**/*.js', '!dist/**', '!node_modules/**', '!gulpfile.babel.js', '!public/lib/**'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

// Run specified tasks
gulp.task('transpile-production', runSequence('babelify', 'transfer_json', 'transfer_jades', 'transfer_libs'));
gulp.task('transpile', runSequence('eslint', 'babelify', 'transfer_json', 'transfer_jades', 'transfer_libs'));
// gulp.task('install', runSequence('bower'));
gulp.task('default', runSequence('transpile'));

// Script for production
gulp.task('production', runSequence('transpile-production', 'bower'));
