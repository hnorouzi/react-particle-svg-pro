const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: isDevelopment ? './examples/index.js' : './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'bundle.js' : 'index.js',
      library: 'ReactParticleSVG',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: isDevelopment ? {
      static: {
        directory: path.join(__dirname, 'examples')
      },
      port: 3000,
      hot: true,
      open: true
    } : {},
    externals: isDevelopment ? {} : {
      react: 'react',
      'react-dom': 'react-dom'
    },
    plugins: isDevelopment ? [
      new HtmlWebpackPlugin({
        template: './examples/index.html'
      })
    ] : []
  };
};