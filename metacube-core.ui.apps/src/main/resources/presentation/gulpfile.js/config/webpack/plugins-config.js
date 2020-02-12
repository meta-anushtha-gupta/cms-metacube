const PATH = require('path');
const glob = require('glob');
const webpack = require('webpack');

const config = require('../../config');

const ROOT = '../../../';
const PLUGINS = PATH.resolve(__dirname, ROOT, 'plugins/*/js/index.js');
const BUILD_FOLDER = PATH.resolve(__dirname, ROOT, `${config.BUILD_FOLDER}/plugins`);
const DEFAULT_CONFIG = require('./default-config');

/**
 * Constructs a Webpack configuration based on a build context
 * for bundling plugin JS assets
 *
 * @param context {String} Build context to compile for (see CONFIG_CONTEXT for options)
 */
const pluginsConfigs = (context = DEFAULT_CONFIG.CONTEXT.BROWSER) => {
    const files = glob.sync(PLUGINS);

    return files.map(function(appPath) {
        const appPathPieces = appPath.split('/');
        const appName = appPathPieces[appPathPieces.indexOf('plugins') + 1];

        return Object.assign({
                entry: {
                    [appName]: appPath
                },
                output: {
                    path: PATH.resolve(BUILD_FOLDER, `${appName}/js`),
                    filename: '[name].js',
                    chunkFilename: '[name].bundle.js',
                    publicPath: '/etc/designs/metacube/js/'
                }
            },
            DEFAULT_CONFIG(context)
        );
    });
};

module.exports = pluginsConfigs;
