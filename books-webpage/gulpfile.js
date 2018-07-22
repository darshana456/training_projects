var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');

var browserSync = require('browser-sync').create();

gulp.task('sass', function(){
  return gulp.src('app/scss/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch',['test', 'sass'], function(){
  console.log(1);
  gulp.watch('app/scss/*.scss', ['sass']);
  console.log(2);
  gulp.watch('app/*.html', browserSync.reload);
  console.log(3);
  gulp.watch('app/js/*.js', browserSync.reload);
})

gulp.task('test', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})
