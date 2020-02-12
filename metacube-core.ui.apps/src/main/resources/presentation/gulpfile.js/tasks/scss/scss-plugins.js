const PATH = require('path');
const glob = require('glob');
const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');

const scssCompiler = require('./scss-compiler');
const config = require('../../config');

const ROOT = '../../../';
const PLUGINS = PATH.resolve(__dirname, ROOT, 'plugins/*');
const SCSS_SRC_FILES = PATH.resolve(__dirname, ROOT, '/scss/**/*.scss');
const BUILD_FOLDER = PATH.resolve(__dirname, ROOT, `${config.BUILD_FOLDER}/plugins`);

/**
 * @method getPluginConfigs
 * @description Constructs a collection of plugin configurations
 */
const getPluginConfigs = () => {
    const files = glob.sync(PLUGINS);

    return files.map(function(appPath) {
        const appPathPieces = appPath.split('/');
        const appName = appPathPieces[appPathPieces.indexOf('plugins') + 1];

        return {
            app: `${appPath}/${SCSS_SRC_FILES}`,
            src: `${appPath}/${SCSS_SRC_FILES}`,
            dist: `${BUILD_FOLDER}/${appName}/css`
        };
    });
};

// Compile CSS bundle
gulp.task('plugins:scss', ['plugins:lint:scss'], () => {
    const pluginConfigs = getPluginConfigs();

    pluginConfigs.forEach((plugin) => {
        return scssCompiler.build({
            app: plugin.src,
            src: plugin.src,
            dist: plugin.dist
        });
    });
});

// Watch plugin scss files and compile on changes
gulp.task(
    'plugins:watch:scss',
    ['plugins:scss'],
    () => {
        const pluginConfigs = getPluginConfigs();

        pluginConfigs.forEach((plugin) => {
            scssCompiler.watch(plugin.src, ['plugins:scss']);
        });
    }
);

// Lint plugin scss
gulp.task(
    'plugins:lint:scss',
    () => {
        const pluginConfigs = getPluginConfigs();

        pluginConfigs.forEach((plugin) => {
            scssCompiler.lint(plugin.src);
        });
    }
);