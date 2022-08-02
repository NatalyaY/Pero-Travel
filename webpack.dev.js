const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    devtool: "source-map",
    mode: 'development',
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            { test: /\.css$/i,
                use: [ "style-loader",
                    { loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: true
                        }
                    },
                ],
            },

        ]
    }
});
