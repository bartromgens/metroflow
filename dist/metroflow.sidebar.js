var MetroFlow = MetroFlow || {}; MetroFlow["sidebar"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
styles = __webpack_require__(2);


var DisplaySettings = {
    isDebug: false,
};


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


var Observable = {
    Observable: function() {
        this.observers = [];
        return this;
    },
    registerObserver: function(observer) {
        var index = this.observers.indexOf(observer);
        if (index === -1) {
            this.observers.push(observer);
        }
    },
    unregisterObserver: function(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    },
    notifyAllObservers: function() {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].notify(this);
        }
    },
    notifyBeforeRemove: function() {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].notifyRemove(this);
        }
    },
};


function Observer(notify, notifyRemove) {
    return {
        notify: notify,
        notifyRemove: notifyRemove,
    }
};


module.exports = {
    DisplaySettings: DisplaySettings,
    Observer: Observer,
    Observable: Observable,
    uuidv4: uuidv4,
};

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = paper;

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var core = __webpack_require__(0);

var currentTrack = null;


function setCurrentTrack(track) {
    if (currentTrack && currentTrack.id === track.id) {
        return;
    }
    var colorPicker = document.getElementById("track-color-picker");
    colorPicker.value = track.segmentStyle.strokeColor;
    document.getElementById("station-stroke-color-picker").value = track.stationStyle.strokeColor;

    $("#track-width-slider").slider('value', track.segmentStyle.strokeWidth);
    $("#station-radius-slider").slider('value', track.stationStyle.stationRadius);
    $("#station-stroke-width-slider").slider('value', track.stationStyle.strokeWidth);

    currentTrack = track;
    updateTableTrack(track);
}


function setExampleMapAction(callback) {
    $("#button-example-map1").bind("click", loadFilename);
    $("#button-example-map2").bind("click", loadFilename);

    function loadFilename() {
        var filename = $(this).data("filename");
        console.log(filename);
        callback(filename);
    }
}


function setTrackColorChangeAction(callback) {
    var colorPicker = document.getElementById("track-color-picker");
    colorPicker.addEventListener("input", watchColorPicker, false);
    colorPicker.addEventListener("change", watchColorPicker, false);

    function watchColorPicker(event) {
        var color = event.target.value;
        callback(color);
    }
}


function setTrackWidthSliderChangeAction(callback) {
    $("#track-width-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        console.log(ui.value);
        callback(ui.value);
    }
}


function setStationRadiusSliderChangeAction(callback) {
    $("#station-radius-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        callback(ui.value);
    }
}

function setStationStrokeWidthSliderChangeAction(callback) {
    $("#station-stroke-width-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        callback(ui.value);
    }
}



function setStationStrokeColorChangeAction(callback) {
    var colorPicker = document.getElementById("station-stroke-color-picker");
    colorPicker.addEventListener("input", watchColorPicker, false);
    colorPicker.addEventListener("change", watchColorPicker, false);

    function watchColorPicker(event) {
        var color = event.target.value;
        callback(color);
    }
}



function showTracks(tracks) {
    var sideBar = $("#sidebar");
}


function updateTableTrack(track) {
    console.log('TrackObserver.trackChanged()');
    if (!currentTrack || currentTrack.id !== track.id) {
        return;
    }
    $("#track-table tbody").empty();
    for (var i in track.stations) {
        var station = track.stations[i];
        addStationRow(station);
    }

    function addStationRow(station) {
        var markup = "<tr><td><input id='station-row-" + station.id + "' type='text' name='station' value='" + station.name + "' data-stationid='" + station.id + "'></td></tr>";
        $("#track-table tbody").append(markup);
        $("#station-row-" + station.id).bind("change", stationNameInputChange)
    }

    function stationNameInputChange() {
        console.log("stationNameInputChange");
        var stationId = $(this).data("stationid");
        console.log('stationid', stationId);
        var station = track.findStation(stationId);
        console.log('station', station);
        console.log('value', $(this).val());
        station.name = $(this).val();
        signalTrackInfoChanged(currentTrack);
    }
}


function notifyTrackChanged(track) {
    var trackObserver = new core.Observer(
        updateTableTrack,
        function(track) {
            return;
        }
    );
    track.registerObserver(trackObserver);
}


var signalTrackInfoChanged = null;

function setTrackChangeAction(callback) {
    signalTrackInfoChanged = callback;
}

function setToggleDebugAction(callback) {
    $("#checkbox-debug").bind("click", callback);
}

function setToggleMinorNamesAction(callback) {
    $("#checkbox-minor-station-names").bind("click", callback);
}


module.exports = {
    notifyTrackChanged: notifyTrackChanged,
    setExampleMapAction: setExampleMapAction,
    setCurrentTrack: setCurrentTrack,
    setTrackColorChangeAction: setTrackColorChangeAction,
    setTrackWidthSliderChangeAction: setTrackWidthSliderChangeAction,
    setStationRadiusSliderChangeAction: setStationRadiusSliderChangeAction,
    setStationStrokeWidthSliderChangeAction: setStationStrokeWidthSliderChangeAction,
    setStationStrokeColorChangeAction: setStationStrokeColorChangeAction,
    setTrackChangeAction: setTrackChangeAction,
    setToggleDebugAction: setToggleDebugAction,
    setToggleMinorNamesAction: setToggleMinorNamesAction,
};

/***/ }),

/***/ 2:
/***/ (function(module, exports) {


var fillColor = "white";
var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var selectionColor = rgbToHex(0, 100, 0);


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


var MapStyle = {

};


var TrackStyle = {

};


var SegmentStyle = {
    strokeColor: rgbToHex(255, 0, 0),
    strokeWidth: strokeWidth,
    selectionColor: selectionColor,
    fullySelected: false
};


var StationStyle = {
    strokeColor: rgbToHex(0, 0, 0),
    strokeWidth: strokeWidth/2,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: selectionColor,
    fullySelected: false
};


var StationMinorStyle = {
    strokeColor: SegmentStyle.strokeColor,
    strokeWidth: SegmentStyle.strokeWidth,
    selectionColor: selectionColor,
    minorStationSize: SegmentStyle.strokeWidth * 2.0,
    fullySelected: false
};


function createStationStyle() {
    var newStyle = {};
    Object.keys(StationStyle).forEach(function(key) {
        newStyle[key] = StationStyle[key];
    });
    return newStyle;
}

function createStationMinorStyle() {
    var newStyle = {};
    Object.keys(StationMinorStyle).forEach(function(key) {
        newStyle[key] = StationMinorStyle[key];
    });
    return newStyle;
}

function createSegmentStyle() {
    var newStyle = {};
    Object.keys(SegmentStyle).forEach(function(key) {
        newStyle[key] = SegmentStyle[key];
    });
    return newStyle;
}


module.exports = {
    createStationStyle: createStationStyle,
    createSegmentStyle: createSegmentStyle,
    createStationMinorStyle: createStationMinorStyle,
    rgbToHex: rgbToHex,
};

/***/ })

/******/ });