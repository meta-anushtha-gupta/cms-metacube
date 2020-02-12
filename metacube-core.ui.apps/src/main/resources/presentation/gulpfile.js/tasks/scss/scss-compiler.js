const PATH = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps');

const optimize = !!gutil.env.optimize;

const ROOT = '../../../';

const LINT_CONFIG = PATH.resolve(__dirname, ROOT, 'gulpfile.js/config/stylelint-config.json');

const autoprefixerConfig = {
    browsers: ['last 2 version', 'Safari 5', 'Firefox 14', 'IE >= 9', 'iOS 7'],
    map: true
};

const sassConfig = {
    outputStyle: !optimize ? 'expanded' : 'compressed'
};

/**
 * @method build
 * @description Gulp task responsible for compiling a css bundle from a collection of scss files
 * @param config {Object} Config object with `app` entry point reference and `dist` reference to publish bundle to
 */
function build(config) {
    return gulp.src(config.app)
        .pipe(changed(config.dist, {extension: '.scss'}))
        .pipe(plumber())
        .pipe(gulpIf(!optimize, sourcemap.init()))
        .pipe(sass(sassConfig).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerConfig))
        .pipe(gulpIf(!optimize, sourcemap.write()))
        .pipe(gulp.dest(config.dist));
}

/**
 * @method lint
 * @description Gulp task responsible for linting a collection of scss files
 * @param src {String} Source path to lint files
 */
function lint(src) {
    const gulpStylelint = require('gulp-stylelint');

    return gulp.src(src)
        .pipe(plumber())
        .pipe(gulpStylelint({
            configFile: LINT_CONFIG,
            reporters: [{
                formatter: 'string',
                console: true
            }]
        }));
}

/**
 * @method watch
 * @description Gulp task responsible for watching a collection of scss files and applying a callback task on change
 * @param src {String} Source path to watch files
 * @param callbackTasks {Array} Collection of tasks to run on change events
 */
function watch(src, callbackTasks) {
    return gulp.watch(src, callbackTasks);
}

/**
 * Public api
 * @type {{build: build, lint: lint, watch: watch}}
 */
module.exports = {
    build,
    lint,
    watch
};