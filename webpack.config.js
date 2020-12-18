const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => {
	const isDev = !env.production;
	const isWatching = env.watch;

	const APP_DIR = './src';
	const BUILD_DIR = 'dist';
	const BUILD_ASSETS_DIR = 'static';
	const ENTRY_FILENAME = 'index.js';
	const OUTPUT_SCRIPTS = isDev ? 'bundle_[contenthash].js' : 'index.js';
	const OUTPUT_STYLES = isDev ? `${BUILD_ASSETS_DIR}/bundle_[contenthash].css` : `${BUILD_ASSETS_DIR}/main.css`;

	return {
		mode: isDev ? 'development' : 'production',
		devtool: isDev && 'eval',
		entry: isDev ? path.resolve(__dirname, APP_DIR, 'hmr.js') : path.resolve(__dirname, APP_DIR, ENTRY_FILENAME),
		output: {
			path: path.resolve(__dirname, BUILD_DIR),
			filename: OUTPUT_SCRIPTS,
			publicPath: '',
		},
		devServer: {
			contentBase: './dist',
		},
		module: {
			rules: [
				{
					test: /\.s?[ac]ss$/i,
					use: [isWatching ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
						name: `${BUILD_ASSETS_DIR}/images/[name].[ext]`,
						limit: isWatching ? 10240 : 0, // Inline less than 10KB
					},
				},
				{
					test: /\.svg$/i,
					loader: 'url-loader',
					options: {
						name: `${BUILD_ASSETS_DIR}/icons/[name].[ext]`,
						limit: isWatching ? 10240 : 0,
					},
				},
				{
					test: /\.(png|jpe?g|svg)$/i,
					loader: 'image-webpack-loader',
					options: {
						enforce: 'pre',
						bypassOnDebug: true,
						limit: isWatching ? 10240 : 0,
					},
				},
				{
					test: /\.(ttf|woff|woff2|otf)$/i,
					loader: 'url-loader',
					options: {
						name: `[name].[ext]`,
						outputPath: 'static/fonts',
						publicPath: 'fonts/',
						limit: isWatching ? 10240 : 0,
					},
				},
			],
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HTMLWebpackPlugin({
				template: './template.html',
				filename: 'index.html',
				showErrors: isDev,
				minify: !isDev,
			}),
			new MiniCssExtractPlugin({
				filename: OUTPUT_STYLES,
			}),
		],
	};
};
