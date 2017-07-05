var MetroFlow = MetroFlow || {}; MetroFlow["styles"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {


var fillColor = "white";
var strokeWidth = 8;
var stationRadius = 1*strokeWidth;


var MapStyle = {

};

var TrackStyle = {

};


var SegmentStyle = {
    strokeColor: "red",
    strokeWidth: strokeWidth,
    selectionColor: "green",
    fullySelected: false,
};


var StationStyle = {
    strokeColor: "black",
    strokeWidth: strokeWidth/2,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: "green",
    fullySelected: false,
};

var StationMinorStyle = {
    strokeColor: "red",
    strokeWidth: strokeWidth,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: "green",
    fullySelected: false,
};


function createStationStyle() {
    return Object.create(StationStyle);
}

function createStationMinorStyle() {
    return Object.create(StationMinorStyle);
}

function createSegmentStyle() {
    return Object.create(SegmentStyle);
}


module.exports = {
    createStationStyle: createStationStyle,
    createSegmentStyle: createSegmentStyle,
    createStationMinorStyle: createStationMinorStyle,
};

/***/ })

/******/ });