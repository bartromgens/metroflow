# metroflow

A javascript library to create metro (subway) map style flowcharts on an HTML canvas. 

**WARNING**: This is a work in progress and is not ready to be used yet.

## Demo

A metro-map creater build on the MetroFlow library:
https://bartromgens.github.io/metroflow/

## Usage

### Include `metroflow.js` in your project
Because metroflow uses paper.js with paperscript, the scope of each file is limited to that file. 

Therefore, to use `metroflow.js` in your project, you have two options,
 - bundle `metroflow.js` in your project file, and include your project in your HTML with the `type="text/paperscript"` attribute.
 - manually export the library manually via `window.globals`

#### Option 1: Bundling (webpack example)
Bundling of `metroflow.js` into your project can, for example, be done with webpack.
An example webpack configuration is found in `doc/webpack.config.js`. 
You have to include the library in your main project,
```javascript
var MetroFlow = require("./<path-to-lib>/metroflow.js");
```
And run webpack to create your bundle,
```bash
$ webpack --progress --colors --watch
```

#### Option2: Exporting MetroFlow via windows.globals
Alternatively, you can manually add the following lines at the end of `metroflow.js` to export the library via the window,
```javascript
window.globals = {
    MetroFlow: MetrowFlow
};
```

And include it in your project,
```javascript
var MetroFlow = window.globals.MetroFlow;
```

You can now include `metroflow.js` in your html, separate from your project file, note the `text/paperscript` and `text/javascript`'
```html
<script type="text/paperscript" src="metroflow.js" canvas="paperCanvas"></script>
<script type="text/javascript" src="your_metro_project.js"></script>
```

### Examples

See `example_basic.html` and `examples/basic/basic.js` for a basic example of how to use the library.

For more info, please read the code in `src/js/`, or ask me to write a proper guide and documentation. 

## Development

### Webpack bundles

Install webpack and some plugins and loaders,
```bash
$ sudo npm install webpack -g
$ npm install --save-dev webpack path webpack-manifest-plugin webpack-cleanup-plugin extract-text-webpack-plugin css-loader style-loader babel-core babel-loader babel-preset-es2015
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
