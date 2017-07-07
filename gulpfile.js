const gulp = require('gulp')
const del = require('del')

gulp.task('clean', () => del('./build'))

gulp.task('default', gulp.series(
  'clean'
))
