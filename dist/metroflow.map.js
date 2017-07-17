var MetroFlow = MetroFlow || {}; MetroFlow["map"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

core = __webpack_require__(0);

var minStraight = 30;
var arcRadius = 10.0;

var Segment = {
    Segment: function(stationA, stationB, style) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.style = style;
        this.stationsMinor = [];
        this.id = core.uuidv4();
        this.paths = [];
        this.directionBegin = null;
        this.directionEnd = null;
        this.pathsStraight = [];
        this.isSelected = false;
        return this;
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
    lengthStraight: function() {
        var length = 0.0;
        for (var i in this.pathsStraight) {
            length += this.pathsStraight[i].length;
        }
        return length;
    },
    switchDirection: function() {
        console.log('switchDirection');
        console.log(this.stationA.id, this.stationB.id);
        var stationA = this.stationA;
        this.stationA = this.stationB;
        this.stationB = stationA;
        console.log(this.stationA.id, this.stationB.id);
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
    createPath: function() {
        var path = new Path();
        this.paths.push(path);
        path.strokeColor = this.style.strokeColor;
        if (this.isSelected) {
            path.strokeColor = this.style.selectionColor;
        }
        path.strokeWidth = this.style.strokeWidth;
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.fullySelected = core.DisplaySettings.isDebug;
        return path;
    },
    calcStationPosition: function(station) {
        var pos = this.stationsMinor.indexOf(station);
        var nStations = this.stationsMinor.length + 1; // including main station
        var totalLength = this.lengthStraight();
        var distanceBetweenStations = totalLength/nStations;
        var distanceStation = distanceBetweenStations * (pos+1);
        var currentLength = 0;
        var lengthDone = 0;
        for (var i in this.pathsStraight) {
            currentLength += this.pathsStraight[i].length;
            if (currentLength > distanceStation) {
                path = this.pathsStraight[i];
                break;
            }
            lengthDone += currentLength;
        }
        var middleLine = path.lastSegment.point - path.firstSegment.point;
        var centerPointOnLine = path.firstSegment.point + middleLine.normalize()*(distanceStation-lengthDone);
        return {centerPointOnLine: centerPointOnLine, normalUnitVector: path.getNormalAt(path.length/2.0)};
    },
    draw: function(previous) {
        this.paths = [];
        this.pathsStraight = [];
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
            var previousLastPath = previous.pathsStraight[previous.pathsStraight.length-1];
            var tangentEndLastPath = previousLastPath.getTangentAt(previousLastPath.length);
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
            var beginPoint0 = arcBegin - arcBeginRel.normalize()*arcRadius*2;
            var beginPoint1 = arcBegin - arcBeginRel.normalize()*arcRadius;
            var beginPoint2 = arcBegin + (arcEnd-arcBegin).normalize()*arcRadius;
            var beginPoint3 = arcBegin + (arcEnd-arcBegin).normalize()*arcRadius*2;
            var centerArc1 = beginPoint1 + (beginPoint2-beginPoint1)/2;
            var beginCenter = centerArc1 + (arcBegin-centerArc1)/1.7;

            var pathBegin = this.createPath();
            this.pathsStraight.push(pathBegin);
            var beginA = this.begin();
            var beginB = beginPoint0;
            pathBegin.add(beginA);
            pathBegin.add(beginB);
            this.directionBegin = (beginB - beginA).normalize();

            var endPoint0 = arcEnd - (arcEnd-arcBegin).normalize()*arcRadius*2;
            var endPoint1 = arcEnd - (arcEnd-arcBegin).normalize()*arcRadius;
            var endPoint2 = arcEnd + arcEndRel.normalize()*arcRadius;
            var endPoint3 = arcEnd + arcEndRel.normalize()*arcRadius*2
            var centerArc2 = endPoint2 + (endPoint1-endPoint2)/2;
            var endCenter = centerArc2 + (arcEnd-centerArc2)/1.7;

            var pathArc1 = this.createPath();
            pathArc1.add(beginPoint0);
            pathArc1.add(beginPoint1);
            pathArc1.add(beginCenter);
            pathArc1.add(beginPoint2);
            pathArc1.add(beginPoint3);
            pathArc1.smooth();

            var pathMiddle = this.createPath();
            this.pathsStraight.push(pathMiddle);
            pathMiddle.add(beginPoint3);
            pathMiddle.add(endPoint0);

            var pathArc2 = this.createPath();
            pathArc2.add(endPoint0);
            pathArc2.add(endPoint1);
            pathArc2.add(endCenter);
            pathArc2.add(endPoint2);
            pathArc2.add(endPoint3);
            pathArc2.smooth();

            var pathEnd = this.createPath();
            this.pathsStraight.push(pathEnd);
            var endA = arcEnd + arcEndRel.normalize()*arcRadius*2;
            var endB = this.end();
            pathEnd.add(endA);
            pathEnd.add(endB);
            this.directionEnd = (endB - endA).normalize();
        } else {
            var pathMiddle = this.createPath();
            this.pathsStraight.push(pathMiddle);
            pathMiddle.add(this.begin());
            pathMiddle.add(this.end());
            pathMiddle.smooth();
            this.directionBegin = (this.end() - this.begin()).normalize();
            this.directionEnd = (this.begin() - this.end()).normalize();
        }

        if (core.DisplaySettings.isDebug) {
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
        this.notifyAllObservers(this);
//        path.fullySelected = true;
//        return path;
    },
};


function createSegment(stationA, stationB, style) {
    console.log('createSegment');
    var observable = Object.create(core.Observable).Observable();
    segment = Object.assign(observable, Segment);
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

__webpack_require__(1);
core = __webpack_require__(0);
styles = __webpack_require__(2);


var BaseStation = {
    Station: function(position, style) {
        console.log('new station for point', position);
        this.position = position;
        this.style = style;
        this.id = core.uuidv4().substring(0, 8);
        this.path = null;
        this.isSelected = false;
        this.name = "station";
        this.textPositionRel = null;
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
    setPosition: function(position) {
        this.position = position;
        this.textPositionRel = null;
        this.notifyAllObservers();
    },
};


var Station = {
    draw: function() {
        this.path = new Path.Circle(this.position, this.style.stationRadius);
        if (this.isSelected) {
            this.path.strokeColor = this.style.selectionColor;
        } else {
            this.path.strokeColor = this.style.strokeColor;
        }
        this.path.strokeWidth = this.style.strokeWidth;
        this.path.fillColor = this.style.fillColor;
    },
};


var StationMinor = {
    draw: function(segment) {
        var position = segment.calcStationPosition(this);
        this.position = position.centerPointOnLine;
        var minorStationSize = this.style.minorStationSize;
        this.path = new Path.Line(position.centerPointOnLine, position.centerPointOnLine + position.normalUnitVector*minorStationSize);
        this.path.strokeColor = this.style.strokeColor;
        this.path.strokeWidth = this.style.strokeWidth;
        // this.path.fillColor = this.style.fillColor;
    },
    direction: function() {
        return (this.path.lastSegment.point - this.path.firstSegment.point).normalize();
    }
};


function createStation(position, style) {
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, BaseStation, Station);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationMinor(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, BaseStation, StationMinor);
    station = station.Station(position, style);
    station.stationA = stationA;
    station.stationB = stationB;
    return station;
}


module.exports = {
    createStation: createStation,
    createStationMinor: createStationMinor,
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

core = __webpack_require__(0);
metrotrack = __webpack_require__(6);
metroconnection = __webpack_require__(7);

var DrawSettings = {
    text: true,
    fast: true,
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
    }
};


function createMap() {
    var observable = Object.create(core.Observable).Observable();
    var map = Object.assign(observable, Map);
    map = map.Map();
    return map;
}


module.exports = {
    createMap: createMap,
    createDrawSettings: createDrawSettings,
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var core = __webpack_require__(0);
var metrosegment = __webpack_require__(3);
var metrostation = __webpack_require__(4);
var metrostyles = __webpack_require__(2);


var Track = {
    Track: function() {
        this.stations = [];
        this.stationsMinor = [];
        this.segmentStyle = metrostyles.createSegmentStyle();
        this.stationStyle = metrostyles.createStationStyle();
        this.stationMinorStyle = metrostyles.createStationMinorStyle();
        this.stationMinorStyle.strokeColor = this.segmentStyle.strokeColor;
        this.segments = [];
        this.id = core.uuidv4();
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
    createStation: function(position, previousStation) {
        var station = metrostation.createStation(position, this.stationStyle);
        if (previousStation) {
            this.createSegment(previousStation, station)
        }
        this.stations.push(station);
        console.log('create station', station.id);
        return station;
    },
    createSegment: function(stationA, stationB) {
        console.log('track.createSegment', stationA.id, stationB.id);
        var segment = metrosegment.createSegment(stationA, stationB, this.segmentStyle);
        this.segments.push(segment);
        return segment;
    },
    createStationMinorOnSegmentId: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
        return this.createStationMinor(position, segment);
    },
    createStationMinorBetweenStations: function(stationA, stationB) {
        var segment = this.findSegmentBetweenStations(stationA, stationB);
        return this.createStationMinor(segment.center(), segment);
    },
    createStationMinor: function(position, segment) {
        var station = metrostation.createStationMinor(position, segment.stationA, segment.stationB, this.stationMinorStyle);
        segment.stationsMinor.push(station);
        this.stationsMinor.push(station);
        this.draw();
        return station;
    },
    stationSegments: function(station) {
        var segments = [];
        segments.push(this.segmentToStation(station));
        segments.push(this.segmentFromStation(station));
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
        if (this.stations.length === 0) {
            return null;
        }
        return this.stations[this.stations.length - 1];
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
            for (var j in this.segments[i].paths) {
                paths.push(this.segments[i].paths[j]);
            }
        }
        return paths;
    },
    draw: function() {
        for (var i in this.segments) {
            var segment = this.segments[i];
            var previous = this.segmentToStation(segment.stationA);
            segment.draw(previous);
        }
        for (var i in this.stations) {
            this.stations[i].draw();
        }
        for (var i in this.stationsMinor) {
            var stationMinor = this.stationsMinor[i];
            var segment = this.findSegmentForStationMinor(stationMinor);
            this.stationsMinor[i].draw(segment);
        }
        this.notifyAllObservers(this);
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
        var fontSize = 16;
        this.drawMajorStationNames(paths, fontSize, drawSettings.calcTextPositions);
        fontSize = 10;
        if (drawSettings.minorStationText) {
            this.drawMinorStationNames(fontSize);
        }
    },
    drawMajorStationNames: function(paths, fontSize, calcTextPositions) {
        for (var i in this.stations) {
            var station = this.stations[i];
            if (!calcTextPositions && station.textPositionRel) {
                text = this.createText(station, station.textPositionRel);
                text.fontSize = fontSize;
                continue;
            }
            console.log('recalc best text position');
            var stationRadius = station.style.stationRadius + station.style.strokeWidth;
            var positions = [];
            positions.push(new Point(stationRadius, fontSize / 4.0));
            var text = this.createText(station, positions[0]);
            text.fontSize = fontSize;
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
        var station = this.findStation(id);
        var pos = this.stations.indexOf(station);
        if (pos > -1) {
            station.notifyBeforeRemove();
            var removedStation = this.stations.splice(pos, 1);
        } else {
            console.log('removeStation: station not found');
            return null;
        }
        return removedStation;
    },
    findSegmentByPathId: function(id) {
        for (var i in this.segments) {
            for (var j in this.segments[i].paths) {
                var path = this.segments[i].paths[j];
                if (path.id === id) {
                    return this.segments[i];
                }
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
    }
};


function createTrack() {
    var observable = Object.create(core.Observable).Observable();
    var track = Object.assign(observable, Track);
    track = track.Track();
    return track;
}


module.exports = {
    createTrack: createTrack,
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
core = __webpack_require__(0);
styles = __webpack_require__(2);


var Connection = {
    Connection: function(stationA, stationB) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.id = core.uuidv4();
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
    var observable = Object.create(core.Observable).Observable();
    var connection = Object.assign(observable, Connection);
    connection = connection.Connection(stationA, stationB);
    return connection;
}



module.exports = {
    createConnection: createConnection,
};

/***/ })
/******/ ]);