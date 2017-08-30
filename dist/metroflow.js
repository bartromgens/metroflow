(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("paper"));
	else if(typeof define === 'function' && define.amd)
		define(["paper"], factory);
	else if(typeof exports === 'object')
		exports["MetroFlow"] = factory(require("paper"));
	else
		root["MetroFlow"] = factory(root["paper"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


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

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

util = __webpack_require__(0);

var arcRadius = 8.0;
var minStraight = 4.0*arcRadius;


var Segment = {
    Segment: function(stationA, stationB, style) {
//        console.log('Segment.Segment()', stationA, stationB);
        this.stationA = stationA;
        this.stationB = stationB;
        this.stations = [stationA, stationB];
        this.stationsAuto = [];
        this.stationsUser = [stationA, stationB];
        this.style = style;
        this.id = util.uuidv4();
        this.path = null;
        this.isSelected = false;
        return this;
    },
    addStationAuto: function(station) {
        this.stationsAuto.push(station);
        this.stations.push(station);
    },
    addStationUser: function(station) {
        this.stationsUser.push(station);
        this.stations.push(station);
    },
    begin: function() {
        return this.stationA.position;
    },
    end: function() {
        return this.stationB.position;
    },
    direction: function() {
        return this.end() - this.begin();
    },
    center: function() {
        return this.begin() + (this.end() - this.begin())/2;
    },
    length: function() {
        return this.path.length;
    },
    getOffsetOf: function(position) {
        console.assert(position.x);
        console.assert(this.path, this);
        var position = this.path.getNearestPoint(position);
        return this.path.getOffsetOf(position);
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
    removeStation: function(id) {
        var station = this.findStation(id);
        if (!station) {
            return;
        }
        var pos = this.stations.indexOf(station);
        if (pos > -1) {
            this.stations.splice(pos, 1);
        }
        pos = this.stationsAuto.indexOf(station);
        if (pos > -1) {
            this.stationsAuto.splice(pos, 1);
        }
        pos = this.stationsUser.indexOf(station);
        if (pos > -1) {
            this.stationsUser.splice(pos, 1);
        }
    },
    getAllOnSegmentStations: function() {
        var stations = [];
        stations = stations.concat(this.stationsAuto);
        stations = stations.concat(this.stationsUser);
        var pos = stations.indexOf(this.stationA);
        if (pos != -1) {
            stations.splice(pos, 1);
        }
        var pos = stations.indexOf(this.stationB);
        if (pos != -1) {
            stations.splice(pos, 1);
        }
        return stations;
    },
    removeAllOnSegmentStations: function() {
        var stationsRemoved = [];
        var onSegementStations = this.getAllOnSegmentStations();
        for (var i in onSegementStations) {
            var station = onSegementStations[i];
            var pos = this.stationsAuto.indexOf(station);
            this.stationsAuto.splice(pos, 1);
            pos = this.stationsUser.indexOf(station);
            this.stationsUser.splice(pos, 1);
            stationsRemoved.push(station);
        }
        for (var i in stationsRemoved) {
            var pos = this.stations.indexOf(stationsRemoved[i]);
            if (pos != -1) {
                this.stations.splice(pos, 1);
            }
        }
        return stationsRemoved;
    },
    createNewPath: function() {
        var path = new Path();
        path.strokeColor = this.style.strokeColor;
        if (this.isSelected) {
            path.strokeColor = this.style.selectionColor;
        }
        path.strokeWidth = this.style.strokeWidth;
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.fullySelected = util.DisplaySettings.isDebug;
        return path;
    },
    getNearestStation: function(position, direction) {
        console.assert(position.x);
        var offsetPosition = this.getOffsetOf(position);
        var differenceMin = 1.0e99;
        var station = null;
        var stationOffset = null;
        for (var i in this.stationsUser) {
            var offset = this.getOffsetOf(this.stationsUser[i].position);
            var difference = (offset - offsetPosition) * direction;
            if (difference > 0 && difference < differenceMin) {
                differenceMin = difference;
                station = this.stationsUser[i];
                stationOffset = offset;
            }
        }
        return {station: station, offset: stationOffset};
    },
    getNextStation: function(position) {
        var direction = 1;
        var stationInfo = this.getNearestStation(position, direction);
        if (!stationInfo.station) {
            stationInfo.station = this.stationB;
        }
        return stationInfo;
    },
    getPreviousStation: function(position) {
        var direction = -1;
        var stationInfo = this.getNearestStation(position, direction);
        if (!stationInfo.station) {
            stationInfo.station = this.stationA;
        }
        return stationInfo;
    },
    getStationsBetween: function(stationA, stationB) {
        var offsetA = this.getOffsetOf(stationA.position);
        var offsetB = this.getOffsetOf(stationB.position);
        var stations = [];
        for (var i in this.stationsAuto) {
            var station = this.stationsAuto[i];
            var offset = this.getOffsetOf(station.position);
            if (offset >= offsetA && offset <= offsetB) {
                stations.push(station);
            }
        }
        return stations;
    },
    findStation: function(id) {
        for (var i in this.stations) {
            if (this.stations[i].id === id) {
                return this.stations[i];
            }
        }
        return null;
    },
    createPath: function(previous) {
        this.path = null;
        var stationVector = this.end() - this.begin();
        var maxDistance = Math.min(Math.abs(stationVector.x), Math.abs(stationVector.y)) - minStraight;
        var straightBegin = Math.abs(stationVector.y) - maxDistance;
        var straightEnd = Math.abs(stationVector.x) - maxDistance;
        straightBegin = Math.max(straightBegin, minStraight);
        straightEnd = Math.max(straightEnd, minStraight);
        // TODO: this is ugly and might not always work, needs to be vector based
        var arcBeginRel = new Point(0, straightBegin)*Math.sign(stationVector.y);
        var arcEndRel = new Point(straightEnd, 0)*Math.sign(stationVector.x);
        if (previous) {
            var tangentEndLastPath = previous.path.getTangentAt(previous.path.length);
            var inSameDirectionOutX = (Math.sign(stationVector.x) - tangentEndLastPath.x) !== 0;
            var inSameDirectionOutY = (Math.sign(stationVector.y) - tangentEndLastPath.y) !== 0;
            if (tangentEndLastPath.x !== 0 && !inSameDirectionOutX) {
                arcBeginRel = new Point(straightEnd, 0)*Math.sign(stationVector.x);
                arcEndRel = new Point(0, straightBegin)*Math.sign(stationVector.y);
            } else if (tangentEndLastPath.y !== 0 && inSameDirectionOutY) {
                arcBeginRel = new Point(straightEnd, 0)*Math.sign(stationVector.x);
                arcEndRel = new Point(0, straightBegin)*Math.sign(stationVector.y);
            }
        }
        var differenceXY = Math.abs(Math.abs(stationVector.normalize().x) - Math.abs(stationVector.normalize().y));  // is almost diagonal line?
        var needsArc = (differenceXY > 0.02) && Math.abs(stationVector.x) > minStraight+arcRadius*2 && Math.abs(stationVector.y) > minStraight+arcRadius*2;
        if (needsArc) {
            var arcEnd = this.end() - arcEndRel;
            var arcBegin = this.begin() + arcBeginRel;
            var beginPoint1 = arcBegin - arcBeginRel.normalize()*arcRadius;
            var beginPoint2 = arcBegin + (arcEnd-arcBegin).normalize()*arcRadius;
            var endPoint1 = arcEnd - (arcEnd-arcBegin).normalize()*arcRadius;
            var endPoint2 = arcEnd + arcEndRel.normalize()*arcRadius;

            this.path = this.createNewPath();
            this.path.add(this.begin());
            this.path.add(beginPoint1);
            this.path.quadraticCurveTo(arcBegin, beginPoint2);
            this.path.add(endPoint1);
            this.path.quadraticCurveTo(arcEnd, endPoint2);
            this.path.add(this.end());
        } else {
            this.path = this.createNewPath();
            this.path.add(this.begin());
            this.path.add(this.end());
        }

        if (util.DisplaySettings.isDebug) {
            var debugPointRadius = 4;
            var center = (stationVector)/2.0 + this.begin();
            var centerCircle = new Path.Circle(center, debugPointRadius);
            centerCircle.strokeWidth = 1;
            centerCircle.strokeColor = 'green';
            centerCircle.fillColor = 'green';
            centerCircle.remove();
            var arcBeginCircle = new Path.Circle(arcBegin, debugPointRadius);
            arcBeginCircle.style = centerCircle.style;
            arcBeginCircle.strokeColor = 'green';
            arcBeginCircle.fillColor = 'green';
            var arcEndCircle = new Path.Circle(arcEnd, debugPointRadius);
            arcEndCircle.style = arcBeginCircle.style;
        }
        this.path.sendToBack();
    },
    draw: function(previous, drawSettings) {
        // console.log('segment.draw()');
        var notifyObservers = !drawSettings.fast;
        this.stationA.updatePosition(this, notifyObservers);
        this.stationB.updatePosition(this, notifyObservers);

        this.createPath(previous);

        for (var i in this.stationsUser) {
            var station = this.stationsUser[i];
            station.updatePosition(this, notifyObservers);
        }

        for (var i in this.stationsAuto) {
            var station = this.stationsAuto[i];
            station.updatePosition(this, notifyObservers);
        }
        if (notifyObservers) {
            this.notifyAllObservers(this);
        }
//        path.fullySelected = true;
//        return path;
    },
};


function createSegment(stationA, stationB, style) {
    console.log('createSegment');
    var observable = Object.create(util.Observable).Observable();
    var segment = Object.assign(observable, Segment);
    segment = segment.Segment(stationA, stationB, style);
    return segment;
}


module.exports = {
    createSegment: createSegment,
    minStraight: minStraight,
    arcRadius: arcRadius,
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

util = __webpack_require__(0);
metrotrack = __webpack_require__(5);
metroconnection = __webpack_require__(7);


var DrawSettings = {
    text: true,
    fast: false,
    calcTextPositions: false,
    minorStationText: false,
};


function createDrawSettings() {
    var drawSettings = {};
    Object.keys(DrawSettings).forEach(function(key) {
        drawSettings[key] = DrawSettings[key];
    });
    return drawSettings;
}


var Map = {
    Map: function() {
        this.tracks = [];
        this.connections = [];
        return this;
    },
    createTrack: function() {
        console.log('map.createTrack()');
        var newTrack = metrotrack.createTrack();
        this.tracks.push(newTrack);
        return newTrack;
    },
    createConnection: function(stationA, stationB) {
        console.log('map.createConnection()');
        if (stationA.id === stationB.id) {
            return null
        }
        var newConnection = metroconnection.createConnection(stationA, stationB);
        this.connections.push(newConnection);
        return newConnection;
    },
    removeStation: function(id) {
        for (var i in this.tracks) {
            this.tracks[i].removeStation(id);
        }
        for (var i = this.connections.length - 1; i >= 0; i--) {
            if (this.connections[i].stationA.id === id || this.connections[i].stationB.id === id) {
                this.connections.splice(i, 1);
            }
        }
    },
    stations: function() {
        var stations = [];
        for (var i in this.tracks) {
            stations = stations.concat(this.tracks[i].stations);
        }
        return stations;
    },
    segments: function() {
        var segments = [];
        for (var i in this.tracks) {
            segments = segments.concat(this.tracks[i].segments);
        }
        return segments;
    },
    draw: function(drawSettings) {
        console.time("map.draw");
        project.clear();
        for (var i in this.tracks) {
            this.tracks[i].draw(drawSettings);
        }
        for (var i in this.connections) {
            this.connections[i].draw();
        }
        if (drawSettings.text) {
            var paths = [];
            if (!drawSettings.fast) {
                paths = this.allPaths();
                console.log("map.draw() paths.length", paths.length);
            }
            this.drawStationNames(paths, drawSettings);
        }
        console.timeEnd("map.draw");
    },
    clear: function() {
        this.tracks = [];
    },
    drawStationNames: function(paths, drawSettings) {
        for (var i in this.tracks) {
            this.tracks[i].drawStationNames(paths, drawSettings);
        }
    },
    allPaths: function() {
        var paths = [];
        for (var i in this.tracks) {
            paths = paths.concat(this.tracks[i].allPaths());
        }
        for (var i in this.connections) {
            paths = paths.concat(this.connections[i].allPaths());
        }
        return paths;
    },
    findStation: function(id) {
        for (var i in this.tracks) {
            var station = this.tracks[i].findStation(id);
            if (station) {
                return station;
            }
        }
        return null;
    },
    findStationByPathId: function(id) {
        for (var i in this.tracks) {
            var track = this.tracks[i];
            var station = track.findStationByPathId(id);
            if (station) {
                return {station: station, track: track};
            }
        }
        return {station: null, track: null};
    },
    findSegment: function(id) {
        for (var i in this.tracks) {
            var track = this.tracks[i];
            var segment = track.findSegment(id);
            if (segment) {
                return {segment: segment, track: track};
            }
        }
        return {segment: null, track: null};
    },
    findSegmentByPathId: function(id) {
        for (var i in this.tracks) {
            var track = this.tracks[i];
            var segment = track.findSegmentByPathId(id);
            if (segment) {
                return {segment: segment, track: track};
            }
        }
        return {segment: null, track: null};
    },
    findTrack: function(id) {
        for (var i in this.tracks) {
            if (this.tracks[i].id === id) {
                return this.tracks[i];
            }
        }
        return null;
    },
    notifyAllStationsAndSegments: function () {
        var stations = this.stations();
        for (var i in stations) {
            stations[i].notifyAllObservers();
        }
        var segments = this.segments();
        for (var i in segments) {
            segments[i].notifyAllObservers();
        }
    }
};


function createMap() {
    var observable = Object.create(util.Observable).Observable();
    var map = Object.assign(observable, Map);
    map = map.Map();
    return map;
}


module.exports = {
    createMap: createMap,
    createDrawSettings: createDrawSettings,
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var util = __webpack_require__(0);
var metrosegment = __webpack_require__(3);
var metrostation = __webpack_require__(6);
var metrostyles = __webpack_require__(2);


var Track = {
    Track: function() {
        this.segments = [];
        this.id = util.uuidv4();
        this.stations = [];
        this.stationsMajor = [];
        this.stationsMinor = [];
        this.segmentStyle = metrostyles.createSegmentStyle();
        this.stationStyle = metrostyles.createStationStyle();
        this.stationMinorStyle = metrostyles.createStationMinorStyle();
        this.stationMinorStyle.strokeColor = this.segmentStyle.strokeColor;
        return this;
    },
    setStationRadius: function(radius) {
        this.stationStyle.stationRadius = radius;
    },
    setStationStrokeWidth: function(strokeWidth) {
        this.stationStyle.strokeWidth = strokeWidth;
    },
    setSegmentStyle: function(style) {
        this.segmentStyle = style;
        this.stationMinorStyle.strokeWidth = this.segmentStyle.strokeWidth;
        this.stationMinorStyle.strokeColor = this.segmentStyle.strokeColor;
        this.stationMinorStyle.minorStationSize = this.segmentStyle.strokeWidth * 2.0;
    },
    setStationStyle: function(style) {
        this.stationStyle = style;
    },
    createStationFree: function(position, previousStation) {
        var station = metrostation.createStationFree(position, this.stationStyle);
        if (previousStation) {
            this.createSegment(previousStation, station)
        }
        this.stations.push(station);
        this.stationsMajor.push(station);
        console.log('create station', station.id);
        this.notifyAllObservers();
        return station;
    },
    createStationOnSegment: function(segment, offsetFactor) {
        var station = metrostation.createStationSegment(offsetFactor, this.stationStyle);
        this.stations.push(station);
        this.stationsMajor.push(station);
        segment.addStationUser(station);
        this.notifyAllObservers();
        return station;
    },
    createSegment: function(stationA, stationB) {
        console.log('track.createSegment', stationA.id, stationB.id);
        var segment = metrosegment.createSegment(stationA, stationB, this.segmentStyle);
        this.segments.push(segment);
        this.notifyAllObservers();
        return segment;
    },
    createStationMinorOnSegmentId: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
        position = segment.path.getNearestPoint(position);
        return this.createStationMinor(position, segment);
    },
    createStationMinor: function(position, segment) {
        var station = metrostation.createStationMinor(position, segment.stationA, segment.stationB, this.stationMinorStyle);
        segment.addStationAuto(station);
        station.setPosition(position, segment);
        this.stations.push(station);
        this.stationsMinor.push(station);
        this.notifyAllObservers();
        return station;
    },
    segmentToStation: function(station) {
        for (var i in this.segments) {
            var segment = this.segments[i];
            if (segment.stationB.id === station.id) {
                return segment;
            }
        }
        return null;
    },
    segmentFromStation: function(station) {
        for (var i in this.segments) {
            var segment = this.segments[i];
            if (segment.stationA.id === station.id) {
                return segment;
            }
        }
        return null;
    },
    lastAddedStation: function() {
        if (this.stationsMajor.length === 0) {
            return null;
        }
        return this.stationsMajor[this.stationsMajor.length - 1];
    },
    connectedStations: function(station) {
        var stations = [];
        for (var i in this.segments) {
            var segment = this.segments[i];
            if (station.id === segment.stationA.id) {
                stations.push(segment.stationB);
            }
            if (station.id === segment.stationB.id) {
                stations.push(segment.stationA);
            }
        }
        return stations;
    },
    allPaths: function() {
        var paths = [];
        for (var i in this.segments) {
            paths.push(this.segments[i].path);
        }
        return paths;
    },
    draw: function(drawSettings) {
        // console.log('track.draw()');
        for (var i in this.segments) {
            var segment = this.segments[i];
            var previous = this.segmentToStation(segment.stationA);
            segment.draw(previous, drawSettings);
        }
        for (var i in this.stationsMinor) {
            var stationMinor = this.stationsMinor[i];
            var segment = this.findSegmentForStationMinor(stationMinor);
            this.stationsMinor[i].draw(segment);
        }
        for (var i in this.stationsMajor) {
            this.stationsMajor[i].draw();
        }
        // this.notifyAllObservers(this);
    },
    createText: function(station, positionRelative) {
        var text = new PointText(station.position + positionRelative);
        text.justification = 'left';
        text.fillColor = 'black';
        text.content = station.name;
        return text;
    },
    preventIntersectionSegments: function(text, station, paths, positions) {
        if (!paths) {
            return positions[0];
        }
        var positionsTried = 0;
        var intersects = true;
        while (intersects && positionsTried < positions.length) {
            intersects = false;
            for (var j in paths) {
                if (positionsTried >= positions.length-1) {
                    break;
                }
                var path = paths[j];
                intersects = text.intersects(path);
                if (intersects) {
                    var textOld = text;
                    positionsTried++;
                    text = this.createText(station, positions[positionsTried]);
                    text.fontSize = textOld.fontSize;
                    textOld.remove();
                    break;
                }
            }
        }
        return positions[positionsTried];
    },
    drawStationNames: function(paths, drawSettings) {
        var fontSize = 14;
        this.drawMajorStationNames(paths, fontSize, drawSettings.calcTextPositions);
        fontSize = 10;
        if (drawSettings.minorStationText) {
            this.drawMinorStationNames(fontSize);
        }
    },
    drawMajorStationNames: function(paths, fontSize, calcTextPositions) {
        for (var i in this.stationsMajor) {
            var station = this.stationsMajor[i];
            if (!calcTextPositions && station.textPositionRel) {
                text = this.createText(station, station.textPositionRel);
                text.fontSize = fontSize;
                continue;
            }
            var stationRadius = station.style.stationRadius + station.style.strokeWidth;
            var defaultPosition = new Point(stationRadius, fontSize / 4.0)
            var text = this.createText(station, defaultPosition);
            text.fontSize = fontSize;
            if (!calcTextPositions) {
                continue;
            } else {
                console.log('recalc best text position');
                var positions = [];
                positions.push(defaultPosition);
                positions.push(new Point(-stationRadius - text.bounds.width, fontSize / 4.0));
                positions.push(new Point(0, -stationRadius * 1.2));
                positions.push(new Point(stationRadius, -stationRadius * 0.8));
                positions.push(new Point(-text.bounds.width, -stationRadius * 1.2));
                positions.push(new Point(-text.bounds.width-stationRadius, -stationRadius * 0.8));
                positions.push(new Point(0, stationRadius * 2.2));
                positions.push(new Point(stationRadius, stationRadius * 1.4));
                positions.push(new Point(-text.bounds.width, stationRadius * 2.2));
                positions.push(new Point(-text.bounds.width-stationRadius, stationRadius * 1.2));
                var pathsToUse = paths;
                if (paths.length === 0) {
                    pathsToUse = this.stationSegmentPaths(station);
                }
                station.textPositionRel = this.preventIntersectionSegments(text, station, pathsToUse, positions);
            }
        }
    },
    stationSegmentPaths: function(station) {
        var segmentTo = this.segmentToStation(station);
        var segmentFrom = this.segmentFromStation(station);
        var segments = [];
        if (segmentTo) {
            segments.push(segmentTo);
        }
        if (segmentFrom) {
            segments.push(segmentFrom);
        }
        var pathsLocal = [];
        for (var i in segments) {
            for (var j in segments[i].paths) {
                pathsLocal.push(segments[i].paths[j]);
            }
        }
        return pathsLocal;
    },
    drawMinorStationNames: function(fontSize) {
        for (var i in this.stationsMinor) {
            var station = this.stationsMinor[i];
            var stationLineDirection = station.direction();
            var xOffset = 0;
            var position = station.direction()*station.style.minorStationSize*1.2;
            var text = this.createText(station, position);
            text.fontSize = fontSize;
            if (stationLineDirection.x < 0) {
                xOffset = -text.bounds.width;
                text.position += new Point(xOffset, 0);
            }
            if (stationLineDirection.y > 0.01) {
                yOffset = text.bounds.height/1.5;
                text.position += new Point(0, yOffset);
            }
        }
    },
    findStationByPathId: function(id) {
        for (var i in this.stations) {
            var stationId = this.stations[i].path.id;
            if (stationId === id) {
                return this.stations[i];
            }
        }
        return null;
    },
    findStation: function(id) {
        for (var i in this.stations) {
            if (this.stations[i].id === id) {
                return this.stations[i];
            }
        }
        return null;
    },
    removeStation: function(id) {
        console.log('track.removeStation() on track:', this.id);
        function removeFromTrackState(track, id) {
            var station = track.findStation(id);
            if (station) {
                console.log('track.removeStation()', station);
                var pos = track.stations.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stations.splice(pos, 1);
                }
                pos = track.stationsMajor.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stationsMajor.splice(pos, 1);
                }
                pos = track.stationsMinor.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stationsMinor.splice(pos, 1);
                }
            }
        }
        removeFromTrackState(this, id);
        for (var i = this.segments.length - 1; i >= 0; i--) {  // loop backwards because we splice the array
            var segment = this.segments[i];
            if (segment.stationA.id === id || segment.stationB.id === id) {
                var pos = this.segments.indexOf(segment);
                if (pos > -1) {
                    var stationsRemoved = segment.removeAllOnSegmentStations();
                    for (var j in stationsRemoved) {
                        removeFromTrackState(this, stationsRemoved[j].id);
                    }
                    this.segments.splice(pos, 1);
                }
            } else {
                segment.removeStation(id);
            }
        }
        return ;
    },
    findSegmentByPathId: function(id) {
        for (var i in this.segments) {
            if (this.segments[i].path.id === id) {
                return this.segments[i];
            }
        }
        return null;
    },
    findSegment: function(id) {
        for (var i in this.segments) {
            if (this.segments[i].id === id) {
                return this.segments[i];
            }
        }
        return null;
    },
    findSegmentBetweenStations: function(stationA, stationB) {
        for (var i in this.segments) {
            if (stationA.id === this.segments[i].stationA.id
                && stationB.id === this.segments[i].stationB.id) {
                return this.segments[i];
            }
        }
        return null;
    },
    findSegmentForStationMinor: function(stationMinor) {
        return this.findSegmentBetweenStations(stationMinor.stationA, stationMinor.stationB);
    },
    findSegmentsForStation: function(station) {
        var segments = [];
        for (var i in this.segments) {
            var index = this.segments[i].stations.indexOf(station);
            if (index != -1) {
                segments.push(this.segments[i]);
            }
        }
        return segments;
    }
};


function createTrack() {
    var observable = Object.create(util.Observable).Observable();
    var track = Object.assign(observable, Track);
    track = track.Track();
    return track;
}


module.exports = {
    createTrack: createTrack,
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
util = __webpack_require__(0);
styles = __webpack_require__(2);


var Station = {
    Station: function(position, style) {
        console.log('new station for point', position);
        this.position = position;
        this.offsetFactor = null;
        this.style = style;
        this.id = util.uuidv4().substring(0, 8);
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
    updatePosition: function(segment, notifyObservers) {
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
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


var StationPositionSegmentUser = {
    doSetPosition: function(position, segment) {
        this.offsetFactor = segment.getOffsetOf(position) / segment.length();
    },
    updatePosition: function(segment, notifyObservers) {
        var distanceStation = segment.path.length * this.offsetFactor;
        this.position = segment.path.getPointAt(distanceStation);
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


var StationPositionFree = {
    doSetPosition: function(position, segment) {
        this.position = position;
    },
    updatePosition: function(segment, notifyObservers) {
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


function createStationFree(position, style) {
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionFree, StationPainter);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationSegment(offsetFactor, style) {
    console.log('createStationMinor');
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentUser, StationPainter);
    station = station.Station(new Point(0, 0), style);
    station.offsetFactor = offsetFactor;
    station.doSnap = false;
    return station;
}


function createStationMinor(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentAuto, StationMinorPainter);
    station = station.Station(position, style);
    station.stationA = stationA;
    station.stationB = stationB;
    station.name = "minor station";
    station.doSnap = false;
    return station;
}


module.exports = {
    createStationFree: createStationFree,
    createStationSegment: createStationSegment,
    createStationMinor: createStationMinor,
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

util = __webpack_require__(0);
styles = __webpack_require__(2);


var Connection = {
    Connection: function(stationA, stationB) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.id = util.uuidv4();
        this.paths = [];
        return this;
    },
    allPaths: function() {
        return this.paths;
    },
    draw: function() {
        var stationRadiusA = this.stationA.style.stationRadius;
        var stationRadiusB = this.stationB.style.stationRadius;
        var stationStrokeWidthA = this.stationA.style.strokeWidth;
        var stationStrokeWidthB = this.stationB.style.strokeWidth;
        var stationStrokeWidth = Math.min(stationStrokeWidthA, stationStrokeWidthB);
        var stationRadius = Math.min(stationRadiusA, stationRadiusB);
        var difference = this.stationB.position - this.stationA.position;
        var size = new Size(difference.length-stationRadius, stationRadius-stationStrokeWidth/2);
        var offset = new Point(-stationRadius/2, stationRadius/2-stationStrokeWidth/4);
        var rectangle = new Path.Rectangle(this.stationA.position - offset, size);
        rectangle.fillColor = styles.rgbToHex(255, 255, 255);
        rectangle.strokeWidth = 0;
        rectangle.rotate(difference.angle, this.stationA.position);
        var offset = difference.normalize().rotate(90) * stationRadius/2;
        var offsetA1 = offset + difference.normalize()*(stationRadiusA-stationStrokeWidthA/2);
        var offsetB1 = offset - difference.normalize()*(stationRadiusB-stationStrokeWidthB/2);
        var offsetA2 = offset - difference.normalize()*(stationRadiusA-stationStrokeWidthA/2);
        var offsetB2 = offset + difference.normalize()*(stationRadiusB-stationStrokeWidthB/2);
        var line1 = new Path(this.stationA.position + offsetA1, this.stationB.position + offsetB1);
        var line2 = new Path(this.stationA.position - offsetA2, this.stationB.position - offsetB2);
        line1.strokeColor = this.stationA.style.strokeColor;
        line2.strokeColor = this.stationA.style.strokeColor;
        line1.strokeWidth = stationStrokeWidth;
        line2.strokeWidth = stationStrokeWidth;
        this.paths = [];
        this.paths.push(rectangle);
        this.paths.push(line1);
        this.paths.push(line2);
    },
};


function createConnection(stationA, stationB) {
    var observable = Object.create(util.Observable).Observable();
    var connection = Object.assign(observable, Connection);
    connection = connection.Connection(stationA, stationB);
    return connection;
}


module.exports = {
    createConnection: createConnection,
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var metromap = __webpack_require__(4);


function saveMap(map) {
    var mapData = {};
    mapData.tracks = [];
    mapData.connections = [];
    for (var i in map.tracks) {
        var trackData = createTrackData(map.tracks[i]);
        mapData.tracks.push(trackData);
    }
    for (var i in map.connections) {
        var connectionData = createConnectionData(map.connections[i]);
        mapData.connections.push(connectionData);
    }
    console.log(mapData);
    var mapJSONString = JSON.stringify(mapData);
    return mapJSONString;
}


function createTrackData(track) {
    var trackData = {};
    trackData.id = track.id;
    trackData.segmentStyle = track.segmentStyle;
    trackData.stationStyle = track.stationStyle;
    trackData.segments = [];
    trackData.stationsMinor = [];
    for (var j in track.segments) {
        var segmentData = createSegmentData(track.segments[j]);
        trackData.segments.push(segmentData)
    }
    return trackData;
}


function createConnectionData(connection) {
    var connectionData = {
        stationA: connection.stationA.id,
        stationB: connection.stationB.id,
        id: connection.id,
    };
    return connectionData;
}


function createSegmentData(segment) {
    var stationsUserData = [];
    for (var i in segment.stationsUser) {
        stationsUserData.push(createStationData(segment.stationsUser[i]));
    }
    var stationsAutoData = [];
    for (var i in segment.stationsAuto) {
        stationsAutoData.push(createStationData(segment.stationsAuto[i]));
    }
    var segmentData = {
        stationA: createStationData(segment.stationA),
        stationB: createStationData(segment.stationB),
        stationsUser: stationsUserData,
        stationsAuto: stationsAutoData,
        id: segment.id,
    };
    return segmentData;
}


function createStationData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
        offsetFactor: station.offsetFactor,
    };
    return stationData;
}


function createStationMinorData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
        stationA: station.stationA.id,
        stationB: station.stationB.id,
    };
    return stationData;
}


function loadMap(mapJSON) {
    console.log('loadMap');
    if (!mapJSON) {
        // mapJSON = '{"tracks":[{"id":"15479b48-a900-438b-a0fa-2da8c77729af","stations":[{"position":{"x":200,"y":165},"id":"b4212813","name":"station"},{"position":{"x":535,"y":424},"id":"adc99f13","name":"station"},{"position":{"x":806,"y":119},"id":"ebad26f4","name":"station"}],"stationsMinor":[{"position":{"x":274.22056274847716,"y":269.22056274847716},"id":"712c3721","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":341.3700576850888,"y":336.3700576850888},"id":"fb50a4e2","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":408.5195526217004,"y":403.5195526217004},"id":"6c52a2bb","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":634.7959415460184,"y":354.2040584539816},"id":"2f8dadac","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":697.5208152801713,"y":291.4791847198287},"id":"f99d3a55","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":760.2456890143242,"y":228.7543109856758},"id":"61b3fb5a","name":"station","stationA":"adc99f13","stationB":"ebad26f4"}]},{"id":"e93fb48a-518f-4f29-aa6f-1e395233cc09","stations":[{"position":{"x":209,"y":104},"id":"ce3ea5bf","name":"station"},{"position":{"x":400,"y":104},"id":"2ce21052","name":"station"},{"position":{"x":928,"y":354},"id":"292957b8","name":"station"}],"stationsMinor":[{"position":{"x":272.6666666666667,"y":104},"id":"6fee351c","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":336.3333333333333,"y":104},"id":"325fe14a","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":542.2817459305202,"y":104},"id":"074eef3a","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":684.5634918610405,"y":104},"id":"1fba151c","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":820.3205448016022,"y":216.3205448016022},"id":"5a39e0ba","name":"station","stationA":"2ce21052","stationB":"292957b8"}]}]}'
        mapJSON = '{"tracks":[{"id":"3794c750-6605-49df-b810-aa5b0ebb42e8","segmentStyle":{"strokeColor":"red","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":152,"y":239},"id":"3fe7243d","name":"station"},{"position":{"x":687,"y":495},"id":"995a2376","name":"station"}],"stationsMinor":[]},{"id":"6fe22ae9-cd61-4705-aa2d-c457e11901e9","segmentStyle":{"strokeColor":"blue","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":174,"y":142},"id":"8cb86074","name":"station"},{"position":{"x":764,"y":433},"id":"882322b8","name":"station"}],"stationsMinor":[]}]}';
        mapJSON = JSON.parse(mapJSON);
    }
    var map = metromap.createMap();
    for (var i in mapJSON.tracks) {
        var track = loadTrack(map, mapJSON.tracks[i]);
    }
    for (var i in mapJSON.connections) {
        var connection = loadConnections(map, mapJSON.connections[i]);
    }
    return map;
}


function loadConnections(map, connectionData) {
    console.log('load connections');
    var stationA = map.findStation(connectionData.stationA);
    var stationB = map.findStation(connectionData.stationB);
    var connection = map.createConnection(stationA, stationB);
    if (connection) {
        connection.id = connectionData.id;
    }
    return connection;
}


function loadTrack(map, trackData) {
    console.log('load track');
    var track = map.createTrack();
    track.id = trackData.id;
    track.setSegmentStyle(trackData.segmentStyle);
    track.setStationStyle(trackData.stationStyle);
    for (var i in trackData.segments) {
        var segmentData = trackData.segments[i];
        loadSegment(map, track, segmentData);
    }
    return track;
}


function loadSegment(map, track, segmentData) {
    console.log('load segment');
    var stationAPoint = new Point(segmentData.stationA.position.x, segmentData.stationA.position.y);
    var stationBPoint = new Point(segmentData.stationB.position.x, segmentData.stationB.position.y);
    var stationA = map.findStation(segmentData.stationA.id);
    var stationB = map.findStation(segmentData.stationB.id);
    var segment = null;
    if (stationA && stationB) {
        segment = track.createSegment(stationA, stationB);
    } else if (stationA) {
        stationB = track.createStationFree(stationBPoint, stationA);
        stationB.id = segmentData.stationB.id;
        stationB.name = segmentData.stationB.name;
        segment = track.findSegmentsForStation(stationB)[0];
    } else if (stationB) {
        stationA = track.createStationFree(stationAPoint);
        stationA.id = segmentData.stationA.id;
        stationA.name = segmentData.stationA.name;
        segment = track.createSegment(stationA, stationB);
    } else {
        stationA = track.createStationFree(stationAPoint);
        stationA.id = segmentData.stationA.id;
        stationA.name = segmentData.stationA.name;
        stationB = track.createStationFree(stationBPoint);
        stationB.id = segmentData.stationB.id;
        stationB.name = segmentData.stationB.name;
        segment = track.createSegment(stationA, stationB);
    }
    console.assert(segment);

    for (var i in segmentData.stationsUser) {
        var stationData = segmentData.stationsUser[i];
        if (segment.stationA.id === stationData.id || segment.stationB.id === stationData.id) {
            continue;
        }
        var offsetFactor = segmentData.offsetFactor;
        var station = track.createStationOnSegment(segment, offsetFactor);
        station.offsetFactor = stationData.offsetFactor;
        station.id = stationData.id;
        station.name = stationData.name;
    }

    for (var i in segmentData.stationsAuto) {
        var stationData = segmentData.stationsAuto[i];
        var station = track.createStationMinor(stationData.position, segment);
        station.id = stationData.id;
        station.name = stationData.name;
    }
}


module.exports = {
    saveMap: saveMap,
    loadMap: loadMap,
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

var util = __webpack_require__(0);
var map = __webpack_require__(4);
var track = __webpack_require__(5);
var segment = __webpack_require__(3);
var station = __webpack_require__(6);
var connection = __webpack_require__(7);
var styles = __webpack_require__(2);
var snap = __webpack_require__(10);
var serialize = __webpack_require__(8);
var revision = __webpack_require__(11);
var zoom = __webpack_require__(12);
var interaction = __webpack_require__(13);


module.exports = {
    util: util,
    map: map,
    track: track,
    segment: segment,
    station: station,
    connection: connection,
    snap: snap,
    styles: styles,
    serialize: serialize,
    revision: revision,
    interaction: interaction,
    zoom: zoom,
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

util = __webpack_require__(0);
metrosegment = __webpack_require__(3);


function snapPosition(track, station, position) {
    var snapDistance = metrosegment.minStraight+metrosegment.arcRadius*2.0;
    var stations = track.connectedStations(station);
    if (stations.length === 0 && track.lastAddedStation()) {
        stations.push(track.lastAddedStation());
    }
    var nearestX = null;
    var nearestY = null;
    var minDistanceX = 1e99;
    var minDistanceY = 1e99;
    for (var i in stations) {
        var stationVector = position - stations[i].position;
        var deltaX = Math.abs(stationVector.x);
        if (deltaX < minDistanceX) {
            nearestX = stations[i];
            minDistanceX = deltaX;
        }
        var deltaY = Math.abs(stationVector.y);
        if (deltaY < minDistanceY) {
            nearestY = stations[i];
            minDistanceY = deltaY;
        }
    }
    var snapX = position.x;
    if (minDistanceX < snapDistance) {
        snapX = nearestX.position.x;
    }
    var snapY = position.y;
    if (minDistanceY < snapDistance) {
        snapY = nearestY.position.y;
    }
    return new Point(snapX, snapY);
}


module.exports = {
    snapPosition: snapPosition,
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
util = __webpack_require__(0);
serialize = __webpack_require__(8);

var maxRevisions = 100;
var revisions = [];
var currentRevision = -1;


function createRevision(map) {
    console.log('createRevision');
    currentRevision++;
    var mapDataString = serialize.saveMap(map);
    if (currentRevision >= revisions.length) {
        revisions.push(mapDataString);
    } else {
        revisions[currentRevision] = mapDataString;
        revisions.splice(currentRevision+1, revisions.length-currentRevision-1);
    }
    while (revisions.length > maxRevisions) {
        revisions.shift();
        currentRevision--;
    }
    console.log('currentRevision', currentRevision);
}


function undo(map) {
    if (currentRevision <= 0) {
        return map;
    }
    currentRevision--;
    var last = revisions[currentRevision];
    map = serialize.loadMap(JSON.parse(last));
    return map;
}


function redo(map) {
    if (currentRevision+1 >= revisions.length) {
        return map;
    }
    currentRevision++;
    var next = revisions[currentRevision];
    map = serialize.loadMap(JSON.parse(next));
    return map;
}


function hasUndo() {
    return currentRevision > 0;
}


function hasRedo() {
    return currentRevision+1 < revisions.length;
}


function clearRevisions() {
    revisions = [];
    currentRevision = -1;
}


module.exports = {
    createRevision: createRevision,
    clearRevisions: clearRevisions,
    undo: undo,
    redo: redo,
    hasUndo: hasUndo,
    hasRedo: hasRedo
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

var map = null;

function setNewMap(newMap) {
    map = newMap;
}

function enableZoomOnCanvas(newMap) {
    map = newMap;
    $("canvas").bind("wheel", function(event) {
        var point = new Point(event.clientX, event.clientY);
        zoom(-event.originalEvent.deltaY, point);

        function allowedZoom(zoom) {
            if (zoom !== paper.view.zoom)
            {
                paper.view.zoom = zoom;
                return zoom;
            }
            return null;
        }

        function zoom(delta, point) {
            if (!delta) return;

            var oldZoom = paper.view.zoom;
            var oldCenter = paper.view.center;
            var viewPos = paper.view.viewToProject(point);
            var newZoom = delta > 0 ? oldZoom * 1.05 : oldZoom / 1.05;

            if (!allowedZoom(newZoom)) {
                return;
            }

            var zoomScale = oldZoom / newZoom;
            var centerAdjust = viewPos.subtract(oldCenter);
            var offset = viewPos.subtract(centerAdjust.multiply(zoomScale)).subtract(oldCenter);

            paper.view.center = view.center.add(offset);

            map.notifyAllStationsAndSegments();
        }
    });
}

module.exports = {
    enableZoomOnCanvas: enableZoomOnCanvas,
    setNewMap: setNewMap,
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var util = __webpack_require__(0);


var map = null;

function setCurrentMap(currentMap) {
    map = currentMap;
}

function showStationContextMenu(stationId) {
    $('#' + stationId).contextMenu();
}


function showStationInfo(station) {
    var $div = $('<div class="station-info">id:' + station.id + '</div>');
    $div.css('top', $('#' + station.id).css("top"));
    $div.css('left', $('#' + station.id).css("left"));
    $('#overlay-content').append($div);
}


function hideStationInfoAll() {
    $(".station-info").hide();
}


function showSegmentContextMenu(segmentId, position) {
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
}


function createStationMinorElement(station, track) {
	$("#overlay").append("<div class=\"station\" id=\"" + station.id + "\" data-station-id=\"" + station.id + "\"></div>")
}


function createMapElements(map, onRemoveStation) {
    $("#overlay").empty();
    var mapElements = [];
    for (var i in map.tracks) {
        var trackElements = createTrackElements(map.tracks[i], onRemoveStation);
        mapElements.push({track: map.tracks[i], stationElements: trackElements.stationElements, segmentElements: trackElements.segmentElements});
    }
    return mapElements
}


function createTrackElements(track) {
    var stationElements = [];
    for (var i in track.stations) {
        var stationElement = createStationElement(track.stations[i], track);
        stationElements.push(stationElement);
    }
    var segmentElements = createSegmentElements(track);
    return {stationElements: stationElements, segmentElements: segmentElements};
}


function createStationElement(station, track) {
	$("#overlay").append("<div class=\"station\" id=\"" + station.id + "\" data-station-id=\"" + station.id + "\"></div>")
    var stationElement = $("#" + station.id);

    updateElementPosition(stationElement, station);
    updateStyle();
    createStationObserver();

    function updateElementPosition(stationElement, station) {
        var viewPosition = paper.view.projectToView(station.position);
	    stationElement.css('top', (viewPosition.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (viewPosition.x - stationElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (util.DisplaySettings.isDebug) {
            stationElement.css('border-width', '1px');
        } else {
            stationElement.css('border-width', '0px');
        }
    }

    function createStationObserver() {
        var stationObserver = new util.Observer(
            function(station) {
                updateElementPosition(this.stationElement, station);
            },
            function(station) {
                this.stationElement.remove();
            }
        );
        stationObserver.stationElement = stationElement;
        station.registerObserver(stationObserver);
    }
    return stationElement;
}


function createSegmentElements(track) {
    console.log('createSegmentElements');
    $(".segment").empty();
    var elements = [];
    for (var i in track.segments) {
        var segment = track.segments[i];
        var element = createSegmentElement(segment, track);
        elements.push(element);
    }
    return elements;
}


function createSegmentElement(segment, track) {
	var segmentElementId = "segment-" + segment.id;
	$("#overlay").append("<div class=\"segment\" id=\"" + segmentElementId + "\" data-segment-id=\"" + segment.id + "\"></div>")
    var segmentElement = $("#" + segmentElementId);

    updateSegmentElementPosition(segmentElement, segment);
    updateStyle();
    createSegmentObserver();

    function updateSegmentElementPosition(segmentElement, segment) {
        var segmentCenterView = paper.view.projectToView(segment.center());
	    segmentElement.css('top', (segmentCenterView.y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segmentCenterView.x - segmentElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (util.DisplaySettings.isDebug) {
            segmentElement.css('border-width', '1px');
        } else {
            segmentElement.css('border-width', '0px');
        }
    }

    function createSegmentObserver() {
        var segmentObserver = new util.Observer(
            function(segment) {
                updateSegmentElementPosition(this.segmentElement, segment);
            },
            function(segment) {
                this.segmentElement.remove();
            }
        );
        segmentObserver.segmentElement = segmentElement;
        segment.registerObserver(segmentObserver);
    }

    return segmentElement;
}


module.exports = {
    createMapElements: createMapElements,
    createTrackElements: createTrackElements,
    createStationElement: createStationElement,
    showStationInfo: showStationInfo,
    hideStationInfoAll: hideStationInfoAll,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
    setCurrentMap: setCurrentMap,
};

/***/ })
/******/ ]);
});