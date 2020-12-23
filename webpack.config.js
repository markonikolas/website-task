module.exports = env => {
	const path = require( 'path' );

	// Env
	const isDev = !env.production;
	const isWatching = !!env.watch;
	const isAnalize = !!env.analyze;

	// Helpers
	const Ternary = require( './helper/Ternary' );

	// Modes
	// Returns first parameter if in n mode, second otherwise
	const inDevMode = new Ternary( isDev );
	const inWatchMode = new Ternary( isWatching );

	// Constants
	const APP_DIR = './src';
	const BUILD_DIR = 'public';
	const BUILD_ASSETS_DIR = 'static';
	const ENTRY_FILENAME = 'index';

	// Filenames
	const assetFilename = inDevMode.check( '[name]', '[contenthash]' );

	// Plugins
	const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
	const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
	const MediaQueryPlugin = require( 'media-query-plugin' );

	const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
	const { BundleAnalyzerPlugin } = isAnalize && require( 'webpack-bundle-analyzer' );
	const { WebpackManifestPlugin } = !isDev && require( 'webpack-manifest-plugin' );
	const { SourceMapDevToolPlugin } = isDev && require( 'webpack' );
	const CssMinimizerPlugin = !isDev && require( 'css-minimizer-webpack-plugin' );

	// Config
	const mode = inDevMode.check( 'development', 'production' );
	const devtool = false;
	const entry = path.resolve( __dirname, APP_DIR, ENTRY_FILENAME );
	const output = {
		path: path.resolve( __dirname, BUILD_DIR ),
		filename: inDevMode.check( '[name].js', '[contenthash].js' ),
		chunkFilename: inDevMode.check( '[name]', '[contenthash].js' ),
		publicPath: ''
	};
	const devServer = {
		contentBase: BUILD_DIR,
		open: {
			target: 'navigator'
		},
		hot: true
	};
	const watchOptions = {
		ignored: /node_modules/,
		aggregateTimeout: 400,
		poll: 1000
	};
	const sourceMap = {
		sourceMap: isDev
	};
	const modules = {
		rules: [
			{
				test: /\.s?[ac]ss$/i,
				use: [
					inWatchMode.check(
						'style-loader',
						MiniCssExtractPlugin.loader
					),
					{
						loader: 'css-loader',
						options: sourceMap
					},
					isWatching && MediaQueryPlugin.loader,
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
					limit: inWatchMode.check( 10240, false )
				}
			},
			{
				test: /\.(png|jpe?g|svg)$/i,
				loader: 'image-webpack-loader',
				options: {
					enforce: 'pre',
					bypassOnDebug: true,
					limit: inWatchMode.check( 10240, false )
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
					limit: inWatchMode.check( 10240, false )
				}
			}
		]
	};

	const optimizationOptions = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				defaultVendors: {
					// Note the usage of `[\\/]` as a path separator for cross-platform compatibility.
					test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
					filename: inDevMode.check( 'vendor.js', '[contenthash].js' ),
					// Tells webpack to ignore splitChunks.minSize, splitChunks.minChunks, splitChunk.
					// maxAsyncRequests and splitChunks.maxInitialRequests options and always create
					// chunks for this cache group.
					enforce: true
				},
				// Imported in main.sass
				normalize: {
					test: /[\\/]node_modules[\\/]normalize.css[\\/]/,
					filename: inDevMode.check( 'vendor.css', '[contenthash].css' ),
					enforce: true
				}
			}
		},
		minimize: !isDev,
		minimizer: [ ]
	};

	if ( CssMinimizerPlugin ) {
		// Webpack 5 feature `...` to 'extend' Terser and other minimizers
		optimizationOptions.minimizer.push( `...`, new CssMinimizerPlugin( {
			parallel: true,
			sourceMap: true,
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: { removeAll: true }
					}
				]
			}
		} ) );
	}

	const optimization = inWatchMode.check( { minimize: false }, optimizationOptions );

	const plugins = [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin( {
			template: './src/template.html',
			filename: 'index.html',
			showErrors: isDev,
			minify: !isDev
		} ),
		new MiniCssExtractPlugin( {
			filename: `${BUILD_ASSETS_DIR}/styles/${assetFilename}.css`
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
			exclude: [ 'vendor.js', 'runtime.js' ]
		} ) );
	}

	const CONFIG = {
		mode,
		devtool,
		entry,
		output,
		devServer,
		watchOptions,
		module: modules,
		optimization,
		plugins
	};

	return CONFIG;
};
