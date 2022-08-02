const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const postcssPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");



module.exports = merge(common, {
    mode: 'production',
    devtool: "source-map",

    output: {
        filename: '[name].[contenthash].js',
    },

    optimization: {
        runtimeChunk: 'single',
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: (pathData) => {
            return pathData.chunk.name == 'vendors' ? "../css/vendors[contenthash].css" : '../css/index[contenthash].css';
        } }),
    ],

    module: {
        rules: [
            { test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader', options: {
                        presets: ['@babel/preset-env']
                    },
                },
            },
            { test: /\.css$/i,
                use: [{ loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                            url: true
                        }
                    },
                    { loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [postcssPresetEnv({browsers: '>= 0.5%, last 6 versions, Firefox ESR, not dead'})],
                            },
                        },
                    },
                ],
            },

        ]
    }

});