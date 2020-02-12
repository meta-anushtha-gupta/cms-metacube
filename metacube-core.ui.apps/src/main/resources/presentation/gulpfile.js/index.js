const gulp = require('gulp');
const gutil = require('gulp-util');
const requireDir = require('require-dir');

console.log(`GULP OPTIMIZE: ${!!gutil.env.optimize}`);

requireDir('./tasks', {recurse: true});

gulp.task('default', ['build:watch:scss', 'build:watch:js']);

gulp.task('deploy', ['build:scss', 'build:js', 'plugins']);

gulp.task('plugins', ['plugins:js', 'plugins:scss']);

gulp.task('plugins:watch', ['plugins:watch:js', 'plugins:watch:scss']);