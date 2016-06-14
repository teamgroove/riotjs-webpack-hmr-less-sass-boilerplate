import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

module.exports =  {
context: `${__dirname}/app`,
  entry: [
  'webpack-dev-server/client?http://localhost:8080/',
  'webpack/hot/dev-server',
  `${__dirname}/app/index`,
  ],

  output: {
    path: `${__dirname}/build`,
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.less'],
    modulesDirectories: [
      `${__dirname}/app/lib`,
      `${__dirname}/node_modules`,
      'node_modules'
    ],
    alias: {
      components: `${__dirname}/app/components`,    // used for tests
      style: `${__dirname}/app/style`
    }
  },
    module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
    ],
    loaders: [
      { test: /\.js$|\.tag$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.(less|css)$/,
        include: /app\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?sourceMap=${CSS_MAPS}&modules&importLoaders=1&localIdentName=[local]${process.env.CSS_MODULES_IDENT || '_[hash:base64:5]'}`,
          'postcss',
          `less?sourceMap=${CSS_MAPS}`
        ].join('!'))
      },
      {
        test: /\.(less|css)$/,
        exclude: /app\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?sourceMap=${CSS_MAPS}`,
          `postcss`,
          `less?sourceMap=${CSS_MAPS}`
        ].join('!'))
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
      }
    ]
  },

  postcss: () => [
    autoprefixer({ browsers: 'last 2 versions' })
  ],

  plugins: ([

    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: ENV!=='production'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({ NODE_ENV: ENV })
    }),

   new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
     new HtmlWebpackPlugin({
      template: './app/index.html',
      minify: { collapseWhitespace: true }
    })
  ]).concat(ENV==='production' ? [
    new webpack.optimize.OccurenceOrderPlugin()
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    //host: '0.0.0.0',
    colors: true,
    publicPath: '/',
    contentBase: './app',
     historyApiFallback: true,
    hot: true,
    progress: true,
   // stats: 'errors-only'
  }
};
