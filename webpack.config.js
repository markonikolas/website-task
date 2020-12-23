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
	const ENTRY_FILENAME = 'index';

	// Filenames
	const assetFilename = ternary( isDev, '[name]', '[contenthash]' );

	// Plugins
	const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
	const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

	const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
	const { BundleAnalyzerPlugin } = isAnalize && require( 'webpack-bundle-analyzer' );
	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );
	const { SourceMapDevToolPlugin } = isDev && require( 'webpack' );

	// Config
	const sourceMap = {
		sourceMap: isDev
	};

	const optimization = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				defaultVendors: {
					// Note the usage of `[\\/]` as a path separator for cross-platform compatibility.
					test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
					filename: isDev ? 'vendor.js' : '[contenthash].js',
					// Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunk.
					// maxAsyncRequests and splitChunks.maxInitialRequests options and always create
					// chunks for this cache group.
					enforce: true
				},
				// Imported in main.sass
				normalize: {
					test: /[\\/]node_modules[\\/]normalize.css[\\/]/,
					filename: isDev ? 'vendor.css' : '[contenthash].css',
					enforce: true
				}
			}
		}
	};

	const plugins = [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin( {
			template: './src/template.html',
			filename: 'index.html',
			showErrors: isDev,
			minify: !isDev
		} ),
		new MiniCssExtractPlugin( {
			filename: `${BUILD_ASSETS_DIR}/${assetFilename}.css`,
			chunkFilename: `${BUILD_ASSETS_DIR}/[name].css`
		} )
	];

	if ( WebpackManifestPlugin ) {
		plugins.push( new WebpackManifestPlugin() );
	}

	if ( BundleAnalyzerPlugin ) {
		plugins.push( new BundleAnalyzerPlugin() );
	}

	if ( SourceMapDevToolPlugin ) {
		plugins.push( new SourceMapDevToolPlugin( {
			filename: 'sourcemaps/[contenthash][ext].map',
			exclude: [ 'vendor.js', 'lodash.js', 'common.js', 'runtime.js' ]
		} ) );
	}

	return {
		mode: ternary( isDev, 'development', 'production' ),
		devtool: false,
		entry: path.resolve( __dirname, APP_DIR, ENTRY_FILENAME ),
		output: {
			path: path.resolve( __dirname, BUILD_DIR ),
			filename: isDev ? '[name].js' : '[contenthash].js',
			chunkFilename: isDev ? '[name]' : '[contenthash].js',
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
							options: sourceMap
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: isDev,
								postcssOptions: {
									plugins: [
										'autoprefixer',
										'postcss-preset-env'
									]
								}
							}

						},
						{
							loader: 'sass-loader',
							options: sourceMap
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
		optimization: !isWatching ? optimization : { minimize: false },
		plugins
	};
};
