const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');
const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

const outputDirectory = path.resolve(
  process.env.BUILD_OUTPUT_DIRECTORY || 'dist'
);

function clean() {
  return deleteAsync([outputDirectory], { force: true });
}

function html() {
  return gulp
    .src('src/*.html')
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file'
      })
    )
    .pipe(gulp.dest(outputDirectory));
}

function styles() {
  return gulp
    .src('src/Scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(outputDirectory, 'css')))
    .pipe(browserSync.stream());
}

function scripts() {
  return esbuild.build({
    entryPoints: ['src/ts/main.ts'],
    bundle: true,
    outfile: path.join(outputDirectory, 'js', 'main.js'),
    format: 'esm',
    target: 'es2020',
    sourcemap: true
  });
}

function images() {
  if (!fs.existsSync('src/images')) {
    return Promise.resolve();
  }

  return gulp
    .src('src/images/**/*', { encoding: false })
    .pipe(gulp.dest(path.join(outputDirectory, 'images')))
    .pipe(browserSync.stream());
}

function fonts() {
  if (!fs.existsSync('src/fonts')) {
    return Promise.resolve();
  }

  return gulp
    .src('src/fonts/**/*', { encoding: false })
    .pipe(gulp.dest(path.join(outputDirectory, 'fonts')))
    .pipe(browserSync.stream());
}

function favicon() {
  if (!fs.existsSync('src/images/favicons/favicon.ico')) {
    return Promise.resolve();
  }

  return gulp
    .src('src/images/favicons/favicon.ico', {
      encoding: false,
      allowEmpty: true
    })
    .pipe(gulp.dest(outputDirectory));
}

function serve(done) {
  browserSync.init({
    server: outputDirectory,
    port: 3000,
    open: false
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
  gulp.watch('src/**/*.html', gulp.series(html, reload));
  gulp.watch('src/**/*.scss', styles); 
  gulp.watch('src/**/*.ts', gulp.series(scripts, reload));
  gulp.watch('src/images/**/*', gulp.series(images, favicon, reload));
  gulp.watch('src/fonts/**/*', gulp.series(fonts, reload));
}

const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, fonts, favicon)
);

const dev = gulp.series(build, serve, watchFiles);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.favicon = favicon;
exports.build = build;
exports.dev = dev;
exports.default = dev;