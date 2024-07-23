// webpack.config.js
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
	output: {
		path: path.join(__dirname, 'dist/'),
		publicPath: './',
	},
	plugins: [
		new PugPlugin({
			pretty: 'auto',
			entry: {
				index: './src/index.pug',
			},
			js: {
				filename: 'js/[name].[contenthash:8].js',
			},
			css: {
				filename: 'css/[name].[contenthash:8].css',
			},
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|sass|scss)$/,
				use: ['css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|ico)/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name].[hash:8][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext][query]',
				},
			},
		],
	},
	devServer: {
		hot: true,
		static: path.join(__dirname, 'dist'),
		watchFiles: {
			paths: ['src/**/*.*', 'sass/**/*.*'],
			options: {
				usePolling: true,
			},
		},
	},
	stats: 'errors-only',
};
