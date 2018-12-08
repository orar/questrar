const path = require("path");

module.exports = {
  module: {
    rules: [
     /* {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "../")
      },
      */
      {
        test: [/\.(bmp|gif|jpe?g|png)$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:8].[ext]",
        },
        include: path.resolve(__dirname, "../"),
      },
      {
        test: [/\.(eot|ttf|svg|woff|woff2)$/],
        loader: require.resolve("file-loader"),
        include: path.resolve(__dirname, "../"),
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',

          },
          'resolve-url-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourcemap: true,
            },
          },
        ],
        include: path.resolve(__dirname, "../"),
      },
    ]
  }
};
