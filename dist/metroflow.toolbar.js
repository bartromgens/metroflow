var MetroFlow = MetroFlow || {}; MetroFlow["toolbar"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports) {


$(function() {
    var buttonMajorStation = $("#button-major-station");
    var buttonMinorStation = $("#button-minor-station");
    var buttonSelect = $("#button-select");

    buttonMajorStation.bind("click", function () {
        console.log('major button');
    });

    buttonMinorStation.bind("click", function () {
        console.log('minor button');
    });
});

function setMajorStationButtonAction(callback) {
    var buttonMajorStation = $("#button-major-station");
    buttonMajorStation.bind("click", callback);
}

function setMinorStationButtonAction(callback) {
    var buttonMinorStation = $("#button-minor-station");
    buttonMinorStation.bind("click", callback);
}

function setSelectButtonAction(callback) {
    var buttonSelect = $("#button-select");
    buttonSelect.bind("click", callback);
}

function setNewTrackButtonAction(callback) {
    var buttonNewTrack = $("#button-new-track");
    buttonNewTrack.bind("click", callback);
}

function setNewConnectionAction(callback) {
    var buttonNewConnection = $("#button-new-connection");
    buttonNewConnection.bind("click", callback);
}

function setUndoAction(callback) {
    $("#button-undo").bind("click", callback);
}

function setRedoAction(callback) {
    $("#button-redo").bind("click", callback);
}

function setCalcTextPositionsAction(callback) {
    $("#button-calc-text-positions").bind("click", callback);
}

function setToggleSnapAction(callback) {
    $("#checkbox-snap").bind("click", callback);
}

function setSaveMapAction(callback) {
    var button = $("#button-save-map");
    button.bind("click", callback);
}

function setLoadMapAction(callback) {
    document.getElementById('file-input')
        .addEventListener('change', callback, false);
}


module.exports = {
    setMajorStationButtonAction: setMajorStationButtonAction,
    setMinorStationButtonAction: setMinorStationButtonAction,
    setSelectButtonAction: setSelectButtonAction,
    setNewTrackButtonAction: setNewTrackButtonAction,
    setNewConnectionAction: setNewConnectionAction,
    setUndoAction: setUndoAction,
    setRedoAction: setRedoAction,
    setToggleSnapAction: setToggleSnapAction,
    setCalcTextPositionsAction: setCalcTextPositionsAction,
    setSaveMapAction: setSaveMapAction,
    setLoadMapAction: setLoadMapAction
};

/***/ })

/******/ });