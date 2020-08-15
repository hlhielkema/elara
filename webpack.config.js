const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'elara.css',
        }),
    ],
    entry: './src/elara.js',
    mode: 'production',
    output: {
        filename: 'elara.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, // instead of style-loader
                    'css-loader',
                ],
            },
        ],
    },
};
