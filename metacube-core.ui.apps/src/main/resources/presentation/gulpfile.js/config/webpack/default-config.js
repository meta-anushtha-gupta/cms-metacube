const PATH = require('path');
const gutil = require('gulp-util');
const glob = require('glob');
const webpack = require('webpack');

const optimize = !!gutil.env.optimize;
const config = require('../../config');

const ROOT = '../../../';
const APP_FOLDER = PATH.resolve(__dirname, ROOT, 'js/');
const AEM_COMPONENT_FOLDER = PATH.resolve(__dirname, ROOT, config.AEM_COMPONENT_FOLDER);
const ESLINT_CONFIG = PATH.resolve(__dirname, ROOT, 'gulpfile.js/config/eslint-config.json');
const CONFIG_CONTEXT = {
    BROWSER: 'BROWSER',
    TEST: 'TEST'
};

/**
 * @method constructPlugins
 * @description Constructs an array of Webpack plugins to use
 * @return {[*]}
 */
const constructPlugins = (context) => {
    const plugins = [
        new webpack.NoEmitOnErrorsPlugin()
    ];

    if (optimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                mangle: true
            })
        );
    }

    if(context !== CONFIG_CONTEXT.TEST) {
        // Optimize the repeated dependencies by bundling any dependencies
        // used more than once into the platform bundle
        plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                children: true,
                minChunks: 2
            })
        );
    }

    return plugins;
};

/**
 * Constructs a Webpack configuration based on a build context
 *
 * IMPORTANT: The order of the module loaders matters!
 * Ensure the babel-loader is listed first, as the transpiled versions of the modules
 * were captured in memory and run through eslint.
 *
 * @param context {String} Build context to compile for (see CONFIG_CONTEXT for options)
 */
const defaultConfig = (context = CONFIG_CONTEXT.BROWSER) => {
    return {
        devtool: optimize ? '' : 'inline-source-map',
        bail: true,
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [/node_modules/],
                    options: {
                        compact: false,
                        cacheDirectory: false,
                        plugins: [
                            'transform-runtime'
                        ],
                        presets: [
                            'es2015',
                            'stage-0'
                        ]
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'eslint-loader',
                    exclude: [
                        /node_modules/
                    ],
                    options: {
                        configFile: ESLINT_CONFIG,
                        fix: true
                    }
                }
            ]
        },
        plugins: constructPlugins(context),
        resolve: {
            modules: ["node_modules", APP_FOLDER, AEM_COMPONENT_FOLDER]
        }
    }
};

// Attach the CONFIG_CONTEXT so that it can be used externally
defaultConfig.CONTEXT = CONFIG_CONTEXT;

module.exports = defaultConfig;
