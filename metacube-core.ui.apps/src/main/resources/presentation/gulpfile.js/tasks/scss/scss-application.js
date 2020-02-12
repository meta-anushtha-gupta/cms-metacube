const PATH = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');

const scssCompiler = require('./scss-compiler');
const config = require('../../config');

const ROOT = '../../../';
const SCSS_SRC_FOLDER = PATH.resolve(__dirname, ROOT, 'scss/');
const SCSS_SRC_FILES = PATH.resolve(__dirname, ROOT, SCSS_SRC_FOLDER, '**/*.scss');
const SCSS_APP_FILES = PATH.resolve(__dirname, ROOT, SCSS_SRC_FOLDER, 'apps/*.scss');
const SCSS_BUILD_FOLDER = PATH.resolve(__dirname, ROOT, `${config.BUILD_FOLDER}css/`);

// Compile CSS bundle
gulp.task('build:scss', ['lint:scss'], () => {
   return scssCompiler.build({
       app: SCSS_APP_FILES,
       src: SCSS_SRC_FILES,
       dist: SCSS_BUILD_FOLDER
   });
});

// Watch scss files and compile on changes
gulp.task(
    'build:watch:scss',
    ['build:scss'],
    scssCompiler.watch.bind(undefined, SCSS_SRC_FILES, ['build:scss'])
);

// Lint scss
gulp.task(
    'lint:scss',
    scssCompiler.lint.bind(undefined, SCSS_SRC_FILES)
);