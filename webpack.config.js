const webpack = require('webpack');
const path = require('path');

module.exports = {
	cache: true,
	mode: 'development',
	entry: {
		'anonymous': ['./client/Anonymous/index', 'webpack-hot-middleware/client'],
		'user': ['./client/User/index', 'webpack-hot-middleware/client']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/static'
	},
	devServer: {
		contentBase: './dist',
		hot: true
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'client'),
				query: { cacheDirectory: true }
			}
		]
	},
	node: { fs: 'empty' }
};
