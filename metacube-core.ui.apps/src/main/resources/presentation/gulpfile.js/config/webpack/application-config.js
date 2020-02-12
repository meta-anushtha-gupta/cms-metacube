const PATH = require('path');
const glob = require('glob');
const webpack = require('webpack');

const config = require('../../config');

const ROOT = '../../../';
const APP_ENTRY_NAME = 'platform';
const APP_FOLDER = PATH.resolve(__dirname, ROOT, 'js/');
const APP_ENTRY_FILE = PATH.resolve(__dirname, ROOT, APP_FOLDER, `apps/${APP_ENTRY_NAME}/index.js`);
const BUILD_FOLDER = PATH.resolve(__dirname, ROOT, `${config.BUILD_FOLDER}js/`);
const DEFAULT_CONFIG = require('./default-config');

/**
 * Constructs a Webpack configuration based on a build context
 * for bundling application JS assets
 *
 * @param context {String} Build context to compile for (see CONFIG_CONTEXT for options)
 */
const appConfig = (context = DEFAULT_CONFIG.CONTEXT.BROWSER) => {
    return Object.assign({
            entry: {
                platform: APP_ENTRY_FILE
            },
            output: {
                path: BUILD_FOLDER,
                filename: '[name].js',
                chunkFilename: '[name].bundle.js',
                publicPath: '/etc/designs/metacube/js/'
            }
        },
        DEFAULT_CONFIG(context)
    );
};

module.exports = appConfig;
