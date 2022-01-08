const path = require("path");
const outputDir = path.resolve(__dirname, "dist");
const libraryName = "babelscape-atm";
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = 
{
    mode: "production",
    entry: "./main.ts",
    output: 
    {
        path: outputDir,
        filename: libraryName + ".js"
    },
    devServer: 
    {
        contentBase: outputDir,
        compress: true,
        port: 7000,
    },
    performance: { hints: false },
    resolve: 
    {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: 
    {
        rules : 
        [
            { test: /\.ts$/, loader: "ts-loader" },
            {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: "css-loader"
                  },
                  "sass-loader"
                ]
            },
        ]
    },
    plugins :
    [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/" + libraryName  + ".min.css",
            chunkFilename: "[name].css"
          }),  
                
        new CopyWebpackPlugin({
            patterns : 
            [
                {
                    from: './index.html',
                    to: outputDir,
                    toType: 'dir'
                }
            ]
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
}