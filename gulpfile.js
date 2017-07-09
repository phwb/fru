const del = require('del')
const browserSync = require('browser-sync')
const gulp = require('gulp')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const postcss = require('gulp-postcss')
const cssnext = require('postcss-cssnext')
const imagemin = require('gulp-imagemin')
const addsrc = require('gulp-add-src')
const concat = require('gulp-concat')

const plumberOptions = {
  errorHandler: notify.onError()
}

const clean = () => del('./build')

const images = () => gulp.src('./src/images/**/*')
  .pipe(imagemin({
    svgoPlugins: [{
      convertPathData: false
    }]
  }))
  .pipe(gulp.dest('./build/images'))

const views = () => gulp.src([
  './src/views/*.pug',
  '!./src/views/layout.pug'
])
  .pipe(plumber(plumberOptions))
  .pipe(pug({
    pretty: true,
    data: {}
  }))
  .pipe(gulp.dest('./build'))

const styles = () => gulp.src([
  './node_modules/normalize.css/normalize.css',
  './src/styles/*.css'
])
  .pipe(plumber(plumberOptions))
  .pipe(postcss([
    cssnext()
  ]))
  .pipe(addsrc.prepend('./node_modules/normalize.css/normalize.css'))
  .pipe(concat('main.css'))
  .pipe(gulp.dest('./build/css'))

const fonts = () => gulp.src('./src/fonts/**/*')
  .pipe(gulp.dest('./build/fonts'))

const upload = () => gulp.src('./src/upload/**/*')
  .pipe(gulp.dest('./build/upload'))

const watch = () => {
  gulp.watch('./src/views/*.pug', views)
  gulp.watch('./src/styles/*.css', styles)
  gulp.watch('./src/images/**/*', images)
}

const serve = () => {
  browserSync.init({
    server: './build'
  })
  browserSync
    .watch('./build/**/*.*')
    .on('change', browserSync.reload)
}

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(views, styles, fonts, images, upload),
  gulp.parallel(serve, watch)
))
