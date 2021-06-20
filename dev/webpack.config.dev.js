const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = (env, argv) => ({
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true
    },
    entry: {
        ui: './ui.js',
        figma: './figma.js'
    },
    resolveLoader: {
        modules: [path.join(__dirname, 'node_modules')]
    },

    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader', exclude: /node_modules/ },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: 'vue-style-loader' },
                    { loader: 'css-loader', options: { sourceMap: false } },
                    { loader: 'sass-loader', options: { sourceMap: false } },
                    { loader: 'sass-resources-loader',
                      options: {
                        sourceMap: false,
                        resources: [
                          'src/style/mixins/_mixin.scss'
                        ]
                      }
                    }
                ]
            },
            { test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader' },
        ],
    },

    resolve: {
        // extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.json'],
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname,'./src')
        }
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inlineSource: '.(js)$',
            chunks: ['ui'],
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new VueLoaderPlugin()
    ],
});