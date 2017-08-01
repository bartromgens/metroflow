var MetroFlow = MetroFlow || {}; MetroFlow["station"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports) {

module.exports = paper;

/***/ }),
/* 2 */
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

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
core = __webpack_require__(0);
styles = __webpack_require__(2);


var Station = {
    Station: function(position, style) {
        console.log('new station for point', position);
        this.position = position;
        this.offsetFactor = null;
        this.style = style;
        this.id = core.uuidv4().substring(0, 8);
        this.path = null;
        this.isSelected = false;
        this.name = "station";
        this.textPositionRel = null;
        this.doSnap = true;
        return this;
    },
    toggleSelect: function() {
        if (this.isSelected) {
            this.deselect();
        } else {
            this.select();
        }
    },
    select: function() {
        this.isSelected = true;
    },
    deselect: function() {
        this.isSelected = false;
    },
    setPosition: function(position, segment) {
        this.doSetPosition(position, segment);
        this.textPositionRel = null;
        this.notifyAllObservers();
    },
};


var StationPainter = {
    draw: function() {
        this.path = new Path.Circle(this.position, this.style.stationRadius);
        if (this.isSelected) {
            this.path.strokeColor = this.style.selectionColor;
        } else {
            this.path.strokeColor = this.style.strokeColor;
        }
        this.path.strokeWidth = this.style.strokeWidth;
        this.path.fillColor = this.style.fillColor;
        this.path.bringToFront();
    },
};


var StationMinorPainter = {
    draw: function(segment) {
        var minorStationSize = this.style.minorStationSize;
        this.path = new Path.Line(this.position, this.position + this.normalUnit*minorStationSize);
        this.path.strokeColor = this.style.strokeColor;
        this.path.strokeWidth = this.style.strokeWidth;
        // this.path.fillColor = this.style.fillColor;
    },
    direction: function() {
        return (this.path.lastSegment.point - this.path.firstSegment.point).normalize();
    }
};


var StationPositionSegmentAuto = {
    doSetPosition: function(position, segment) {
        this.position = position;
    },
    updatePosition: function(segment) {
        // console.log('=======================================');
        // console.log('StationPositionSegmentAuto.updatePosition');
        // console.log('this.position', this.position);
        // console.log('segment', segment);
        var offsetFactor = segment.getOffsetOf(this.position) / segment.length();
        var offset = segment.path.length * offsetFactor;
        this.position = segment.path.getPointAt(offset);
        var previousStationInfo = segment.getPreviousStation(this.position);
        // console.log('previousStationInfo', previousStationInfo.station.id);
        var offsetA = previousStationInfo.offset;
        var nextStationInfo = segment.getNextStation(this.position);
        var stationsAuto = segment.getStationsBetween(previousStationInfo.station, nextStationInfo.station);
        var nStations = stationsAuto.length;
        var offsetB = nextStationInfo.offset;
        // console.log('nextStationInfo', nextStationInfo.station.id);
        var totalLength = offsetB - offsetA;
        // console.log('totalLength', totalLength);
        // console.log('segment.length', segment.length());
        var distanceBetweenStations = totalLength/(nStations+1);
        var orderNr = stationsAuto.indexOf(this);
        var stationOffset = distanceBetweenStations * (orderNr+1) + offsetA;
        // console.log('stationsAuto', stationsAuto);
        // console.log('orderNr', orderNr);
        // console.log('stationOffset', stationOffset);
        var position = segment.path.getPointAt(stationOffset);
        console.assert(position);
        if (position) {
            this.position = position;
        }
        this.offsetFactor = segment.getOffsetOf(position) / segment.length();
        // console.log('segment.getOffsetOf(this.position)', segment.getOffsetOf(this.position));
        // console.log('offsetFactor', this.offsetFactor);
        this.normalUnit = segment.path.getNormalAt(stationOffset);
        return this.position;
    }
};


var StationPositionSegmentUser = {
    doSetPosition: function(position, segment) {
        this.offsetFactor = segment.getOffsetOf(position) / segment.length();
    },
    updatePosition: function(segment, orderNr) {
        var distanceStation = segment.path.length * this.offsetFactor;
        this.position = segment.path.getPointAt(distanceStation);
        return this.position;
    }
};


var StationPositionFree = {
    doSetPosition: function(position, segment) {
        this.position = position;
    },
    updatePosition: function() {
        return this.position;
    }
};


function createStationFree(position, style) {
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionFree, StationPainter);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationSegment(offsetFactor, style) {
    console.log('createStationMinor');
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentUser, StationPainter);
    station = station.Station(new Point(0, 0), style);
    station.offsetFactor = offsetFactor;
    station.doSnap = false;
    return station;
}


function createStationMinor(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentAuto, StationMinorPainter);
    station = station.Station(position, style);
    station.stationA = stationA;
    station.stationB = stationB;
    station.doSnap = false;
    return station;
}


module.exports = {
    createStationFree: createStationFree,
    createStationSegment: createStationSegment,
    createStationMinor: createStationMinor,
};

/***/ })
/******/ ]);