# metroflow

A javascript library to create metro (subway) map style flowcharts on an HTML canvas. 

**WARNING**: This is a work in progress and is not ready to be used yet.

## Development

### Webpack bundles

Install webpack and some plugins and loaders,
```bash
$ sudo npm install webpack -g
$ npm install --save-dev webpack path webpack-manifest-plugin webpack-cleanup-plugin extract-text-webpack-plugin css-loader style-loader babel-loader
```

Webpack config is found in `webpack.config.js`.

Watch for changes and compile bundle if found,
```bash
$ webpack --progress --colors --watch
```

Generate minified production files,
```bash
$ webpack -p
```
