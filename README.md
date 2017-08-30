# metroflow

A javascript library to create interactive metro (subway) map style (flow)charts on an HTML canvas. 

**WARNING**: This is a work in progress in pre-alpha state. It is functional, so feel free to try it but expect changes that break your code in future versions.


## Demo

A metro-map editor built with the MetroFlow library:  
https://bartromgens.github.io/metroflow/


## Features

### MetroFlow library
 - Create metro (subway) style vector maps on an HTML canvas
 - Create metro maps via code
 - Create multiple tracks
 - Create stations and minor stations
 - Create connections between stations
 - Style stations, tracks, and text (size, width, color) on track or station level
 - Auto-positioning of tekst
 - HTML element overlays on stations and tracks for interaction
 - Save/load maps to json

### Web-editor
 - Create maps via a web-editor
 - Create tracks
 - Create and position stations and minor stations
 - Connect stations and tracks
 - Edit station and track styles
 - Edit station names
 - Undo/Redo changes
 - Load/save map

### Web-viewer
 - Empty canvas to draw on
 - Load maps created in the web-editor
 - Modify loaded or generated maps via javascript and make them interactive
 - Use generated HTML element overlays at station positions to create interactions and add information
 - Zoom and pan


## Dependencies
 - jQuery
 - [paper.js](http://paperjs.org/)


## Usage

### Include `metroflow.js` in your project
Because metroflow uses paper.js with paperscript, the scope is limited to a file. 

Therefore, to use `metroflow.js` in your project, you have two options,
 - Bundle `metroflow.js` in your project file, and include your project in your HTML with the `type="text/paperscript"` attribute.
 - Manually export the library via `window.globals`. This is easier if you don't use any tool to bundle your modules and files.

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

#### Option 2: Export MetroFlow via windows.globals
Manually add the following lines at the end of `metroflow.js` to export the library via the window,
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

For more info, please read the code in `src/js/`, or create a ticket with a question to write a proper guide and documentation. 


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
