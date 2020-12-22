const path = require( 'path' );

// Helpers
const ternary = require( './helper' );

module.exports = env => {
	// Env
	const isDev = !env.production;
	const isWatching = !!env.watch;
	const isAnalize = !!env.analyze;

	// Constants
	const APP_DIR = './src';
	const BUILD_DIR = 'public';
	const BUILD_ASSETS_DIR = 'static';
	const ENTRY_FILENAME = 'main';

	// Plugins
	const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
	const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
	const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
	const { BundleAnalyzerPlugin } = isAnalize && require( 'webpack-bundle-analyzer' );
	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );

	// Filenames
	const assetFilename = ternary( isDev, '[name]', '[contenthash]' );

	const plugins = [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin( {
			template: './src/template.html',
			filename: 'index.html',
			showErrors: isDev,
			minify: !isDev
		} ),
		new MiniCssExtractPlugin( {
			filename: `${BUILD_ASSETS_DIR}/${assetFilename}.css`
		} )
	];

	if ( WebpackManifestPlugin ) {
		plugins.push( new WebpackManifestPlugin() );
	}

	if ( BundleAnalyzerPlugin ) {
		plugins.push( new BundleAnalyzerPlugin() );
	}

	return {
		mode: ternary( isDev, 'development', 'production' ),
		devtool: isDev && 'cheap-source-map',
		entry: path.resolve( __dirname, APP_DIR, ENTRY_FILENAME ),
		output: {
			path: path.resolve( __dirname, BUILD_DIR ),
			filename: `${assetFilename}.js`,
			publicPath: ''
		},
		devServer: {
			contentBase: BUILD_DIR,
			open: {
				target: 'navigator'
			},
			hot: true
		},
		watchOptions: {
			ignored: /node_modules/,
			aggregateTimeout: 400,
			poll: 1000
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					defaultVendors: {
						// Note the usage of `[\\/]` as a path separator for cross-platform compatibility.
						test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
						filename: '[name].bundle.js',

						// Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunk.
						// maxAsyncRequests and splitChunks.maxInitialRequests options and always create
						// chunks for this cache group.
						enforce: true
					}
				}
			}
		},
		module: {
			rules: [
				{
					test: /\.s?[ac]ss$/i,
					use: [
						ternary(
							isWatching,
							'style-loader',
							MiniCssExtractPlugin.loader
						),
						{
							loader: 'css-loader',
							options: {
								// If css modules are a thing
								// modules: true,
								// modules: "global",

								sourceMap: isDev
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: isDev
							}
						}
					]
				},
				{
					test: /\.js$/i,
					exclude: /node_modules/,
					use: 'babel-loader'
				},
				{
					test: /\.svg$/i,
					loader: 'url-loader',
					options: {
						name: `${BUILD_ASSETS_DIR}/icons/${assetFilename}.[ext]`,
						limit: ternary( isWatching, 10240, false )
					}
				},
				{
					test: /\.(png|jpe?g|svg)$/i,
					loader: 'image-webpack-loader',
					options: {
						enforce: 'pre',
						bypassOnDebug: true,
						limit: ternary( isWatching, 10240, false )
					}
				},
				{
					test: /\.(ttf|woff|woff2|otf)$/i,
					loader: 'url-loader',
					options: {
						name: `${assetFilename}.[ext]`,
						outputPath: 'static/fonts',
						publicPath: 'fonts/',
						limit: isWatching
					}
				},
				{
					test: /\.(png|jpe?g)$/i,
					loader: 'url-loader',
					options: {
						name: `${BUILD_ASSETS_DIR}/images/${assetFilename}.[ext]`,
						limit: ternary( isWatching, 10240, false )
					}
				}
			]
		},
		plugins
	};
};
