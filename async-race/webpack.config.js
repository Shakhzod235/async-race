import path from 'path';

export default {
  mode: 'development',
  entry: './src/main.ts',
  output: {
  path: path.resolve('./', 'public'),
  filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ],
  },
  devtool: 'source-map'
};