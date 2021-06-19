const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// merge config
const { merge } = require('webpack-merge');
const developmentConfig = require('./webpack.dev.config')
const productionConfig = require('./webpack.prod.config')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const commonConfig = {
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
            { test: /\.(png|jpg|gif|webp|svg)$/, loader: [{ loader: 'url-loader' }] },
        ],
    },
    resolve: {
        // extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.json'],
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
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
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}

module.exports =  (env, args) => {
    console.log({env, args});
    switch(args.mode) {
        case 'development':
            return merge(commonConfig, developmentConfig);
        case 'production':
            return merge(commonConfig, productionConfig);
        default:
            throw new Error('No matching configuration was found!');
    }
};