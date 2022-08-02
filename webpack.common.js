const pages = ["index", "excursions", "tripPage"];
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');


module.exports = {

    entry: pages.reduce((config, page) => {
        config[page] = `./src/js/${page}.js`;
        return config;
    }, {}),

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/js'),
        assetModuleFilename: (pathData) => {
            let cleaned = pathData.module.rawRequest.replaceAll('../', '').replace('images', 'img');
            return `../${cleaned}`
        },
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    type: 'javascript/auto',
                    chunks: "all",
                    name: (module) => {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return "vendors~" + packageName;
                    },
                },
                styles: {
                    type: 'css/mini-extract',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    name: 'vendors',
                },
                common: {
                    test: /[\\/]src[\\/]js[\\/]/,
                    chunks: "all",
                    minSize: 0,
                    minChunks: 2,
                    name: (module) => {
                        return "common~" + module.userRequest.replace(module.context, "").replace("\\", "").replace(".js", "");
                    },
                }

            },
        },
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
        new CopyPlugin({patterns: [
            { from: "src/img", to: "../img" },
            { from: "src/video", to: "../video" },
            { from: "src/fonts", to: "../fonts" }
        ]}),
    ].concat(
        pages.map((page) => new HtmlWebpackPlugin({
            inject: true,
            template: `./src/${page}.html`,
            filename: `../${page}.html`,
            chunks: [page],
        }))
    ),

    module: {
        rules: [

            { test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
            },
            { test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },

        ]
    }

};