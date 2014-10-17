gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
rename = require 'gulp-rename'

source =
  coffee: 'src/tsformtranslator.coffee'

destination =
  gs: 'dist'

gulp.task 'lint', ->
  gulp.src(source.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())

gulp.task 'build', ->
  gulp.src(source.coffee)
  .pipe(coffee({bare: true}).on('error', gutil.log))
  .pipe(rename("code.gs"))
  .pipe(gulp.dest(destination.gs))

gulp.task 'watch', ->
  gulp.watch source.coffee, ['lint', 'build']

gulp.task 'dev', ['lint', 'build', 'watch']

gulp.task 'default', ['build']