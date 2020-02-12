const PATH = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');

const ROOT = '../../../';
const WEBPACK_CONFIG_PATH = PATH.resolve(__dirname, ROOT, 'gulpfile.js/config/webpack');
const WEBPACK_CONFIG = require(WEBPACK_CONFIG_PATH);

const pluginConfigs = WEBPACK_CONFIG.pluginsConfig();
const pluginCompilers = pluginConfigs.map(config => webpack(config));

const printReport = function(stats) {
    gutil.log('[webpack]', stats.toString({
        modules: false,
        errorDetails: false,
        timings: false,
        cached: false,
        colors: typeof gutil.env.color !== 'undefined' ? gutil.env.color : true
    }));
};

gulp.task('plugins:js', function(callback) {
    pluginCompilers.forEach((compiler) => {
        compiler.run(function(err, stats) {
            if(err) {
                gutil.log('error', new gutil.PluginError('[webpack]', err));
            }

            printReport(stats);
            callback();
        });
    });
});

gulp.task('plugins:watch:js', function(callback) {
    pluginCompilers.forEach((compiler) => {
        compiler.watch({
            aggregateTimeout: 300
        }, function(err, stats) {
            if(err) {
                gutil.log('error', new gutil.PluginError('[webpack]', err));
            }

            printReport(stats);
        });
    });

    callback();
});
