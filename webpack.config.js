module.exports = {
	entry: __dirname + '/src/app.js',
	output: {
		path: __dirname + '/static/js',
		filename: '[name].min.js'
	},
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'stage-0', 'react']
				}
			}
		]
	}
};