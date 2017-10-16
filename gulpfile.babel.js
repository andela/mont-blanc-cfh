const gulp  = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const gulpLivereload = require('gulp-livereload');
const jshint  = require('gulp-jshint');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const babel = require('gulp-babel');
const coverage = require('gulp-coverage');
const mocha = require('gulp-mocha');

gulp.task('serve', () => {
  nodemon({
    watch: ['./dist', './app', './config', './public'],
    script: 'dist/server.js',
    ext: 'js html jade',
    env: { NODE_ENV: 'development'},
  })
})

gulp.task('watch', () => {
  gulpLivereload.listen();
  gulp.watch('./public/**/*.scss', ['sass']);
  gulp.watch('./public/**/*.html', ['transpile', 'reload']);
  gulp.watch('./public/**/*.css', ['reload']);
  gulp.watch('./public/**/*.js', ['transpile', 'reload']);
});

gulp.task('sass', () => gulp.src('./public/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public'))
);

gulp.task('bower', () => {
  bower({directory: './public/lib'});
});

gulp.task('reload', () => {
  gulpLivereload();
});

gulp.task('public', () => gulp.src([
  './public/**/*',
  './app/**/*',
  './config/**/*',
  './css/**/*'
], {
  base: './'
})
  .pipe(gulp.dest('dist')));


gulp.task('transpile', ['public'], () => {
  gulp.src(
    [
      './**/*.js',
      '!dist/**',
      '!node_modules/**',
      '!public/lib/**'
    ]
  )
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('test', () => gulp.src(
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
  .pipe(gulp.dest('reports')));


gulp.task('default', ['bower', 'transpile', 'sass', 'serve', 'watch']);