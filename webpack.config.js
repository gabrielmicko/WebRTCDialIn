var path = require('path');

module.exports = {
    entry: "./app/app.js",
    output: {
        filename: "./public/js/bundle.js",
        sourceMapFilename: "./public/js/bundle.map"
    },
    devtool: 'eval',
    module: {
        preLoaders: [{
            test: /\.json$/,
            exclude: /(node_modules)/,
            loader: 'json'
        }],
        loaders: [{
            loader: 'babel',
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            query: {
                presets: ['react', 'es2015', 'stage-2']
            }
        }]
    },
    resolve: {
        root: path.resolve('./app'),
        extenstions: ['', '.js']
    }
}
