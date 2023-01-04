// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const mkdirp = require('mkdirp');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const fs = require('fs');
const Prerenderer = require('@prerenderer/prerenderer')
// Make sure you install a renderer as well!
const JSDOMRenderer = require('@prerenderer/renderer-jsdom')


const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const fileContent = fs.readFileSync(path.resolve(__dirname, 'src', 'routes.json'));
const routes = JSON.parse(fileContent);
const prenderedRoutes = routes.routes.map(x => x.path);

const prerenderer = new Prerenderer({
  // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
  staticDir: path.join(__dirname, 'dist'),
  // The plugin that actually renders the page.
  renderer: new JSDOMRenderer()
})

// Initialize is separate from the constructor for flexibility of integration with build systems.
prerenderer.initialize()
.then(() => {
  // List of routes to render.
  return prerenderer.renderRoutes(prenderedRoutes)
})
.then(renderedRoutes => {
  // renderedRoutes is an array of objects in the format:
  // {
  //   route: String (The route rendered)
  //   html: String (The resulting HTML)
  // }
  renderedRoutes.forEach(renderedRoute => {
    try {
      // A smarter implementation would be required, but this does okay for an example.
      // Don't copy this directly!!!
      const outputDir = path.join(__dirname, 'dist', renderedRoute.route)
      const outputFile = `${outputDir}/index.html`

      mkdirp.sync(outputDir)
      fs.writeFileSync(outputFile, renderedRoute.html.trim())
    } catch (e) {
      // Handle errors.
    }
  })

  // Shut down the file server and renderer.
  prerenderer.destroy()
})
.catch(err => {
  // Shut down the server and renderer.
  prerenderer.destroy()
  // Handle errors.
})

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    /*new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: prenderedRoutes,
      renderer: new Renderer({
        injectProperty: '__PRERENDER_INJECTED',
        inject: {
          prerendered: true
        },
        renderAfterDocumentEvent: 'prerender-trigger'
      })
    }),*/
    
    new HtmlWebpackPlugin({
      template: "index.html",
    }),

    new MiniCssExtractPlugin(),    

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
