const path = require('path');

// Plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Helpers
const ternary = require('./helper/');

module.exports = env => {
    const isDev = !env.production;
    const isWatching = !!env.watch;

    const APP_DIR = './src';
    const BUILD_DIR = 'public';
    const BUILD_ASSETS_DIR = 'static';
    const ENTRY_FILENAME = 'main';

    // Filenames
    const assetFilename = ternary(isDev, '[name].[contenthash]', '[contenthash]');

    return {
        mode: ternary(isDev, 'development', 'production'),

        entry: path.resolve(__dirname, APP_DIR, ENTRY_FILENAME),
        output: {
            path: path.resolve(__dirname, BUILD_DIR),
            filename: `${assetFilename}.js`,
            publicPath: '',
        },
        devServer: {
            // Hot only works for css
            contentBase: BUILD_DIR,
            open: {
                target: 'navigator',
            },
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.s?[ac]ss$/i,
                    use: [ternary(isWatching, 'style-loader', MiniCssExtractPlugin.loader), 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.js$/i,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.(png|jpe?g)$/i,
                    loader: 'url-loader',
                    options: {
                        name: `${BUILD_ASSETS_DIR}/images/${assetFilename}.[ext]`,
                        limit: ternary(isWatching, 10240, false), // Inline less than 10KB
                    },
                },
                {
                    test: /\.svg$/i,
                    loader: 'url-loader',
                    options: {
                        name: `${BUILD_ASSETS_DIR}/icons/${assetFilename}.[ext]`,
                        limit: ternary(isWatching, 10240, false),
                    },
                },
                {
                    test: /\.(png|jpe?g|svg)$/i,
                    loader: 'image-webpack-loader',
                    options: {
                        enforce: 'pre',
                        bypassOnDebug: true,
                        limit: ternary(isWatching, 10240, false),
                    },
                },
                {
                    test: /\.(ttf|woff|woff2|otf)$/i,
                    loader: 'url-loader',
                    options: {
                        name: `${assetFilename}.[ext]`,
                        outputPath: 'static/fonts',
                        publicPath: 'fonts/',
                        limit: isWatching,
                    },
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HTMLWebpackPlugin({
                template: './src/template.html',
                filename: 'index.html',
                showErrors: isDev,
                minify: !isDev,
            }),
            new MiniCssExtractPlugin({
                filename: `${BUILD_ASSETS_DIR}/${assetFilename}.css`,
            }),
            new WebpackManifestPlugin({
                filename: 'manifest.json',
            }),
        ],
    };
};
