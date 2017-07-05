var MetroFlow = MetroFlow || {}; MetroFlow["sketcher"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = paper;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
styles = __webpack_require__(2);


var minStraight = 30;
var arcRadius = 10.0;


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


function snapPosition(track, station, position) {
    var snapDistance = minStraight+arcRadius*2.0;
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


var BaseStation = {
    Station: function(position, style) {
        console.log('new station for point', position);
        this.position = position;
        this.style = style;
        this.id = uuidv4().substring(0, 8);
        this.path = null;
        this.isSelected = false;
        return this;
    },
    toggleSelect: function() {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    },
    select: function() {
        this.isSelected = true;
        this.path.strokeColor = this.style.selectionColor;
    },
    unselect: function() {
        this.isSelected = false;
        this.path.strokeColor = this.style.strokeColor;
    },
    setPosition: function(position) {
        this.position = position;
        this.notifyAllObservers();
    },
};


var Station = {
    draw: function() {
        this.path = new Path.Circle(this.position, this.style.stationRadius);
        this.path.strokeColor = this.style.strokeColor;
        this.path.strokeWidth = this.style.strokeWidth;
        this.path.fillColor = this.style.fillColor;
    },
};


var StationMinor = {
    draw: function() {
        var position = this.segment.calcStationPosition(this);
        var minorStationSize = this.style.strokeWidth*2;
        this.path = new Path.Line(position.centerPointOnLine, position.centerPointOnLine + position.normalUnitVector*minorStationSize);
        this.path.strokeColor = this.style.strokeColor;
        this.path.strokeWidth = this.style.strokeWidth;
        // this.path.fillColor = this.style.fillColor;
    },
};


function createStation(position, style) {
    var observable = Object.create(Observable).Observable();
    var station = Object.assign(observable, BaseStation, Station);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationMinor(position, segment, style) {
    console.log('createStationMinor');
    var observable = Object.create(Observable).Observable();
    var station = Object.assign(observable, BaseStation, StationMinor);
    if (!style) {
        style = styles.createStationMinorStyle();
        style.strokeColor = segment.style.strokeColor;
    }
    station = station.Station(position, style);
    segment.stationsMinor.push(station);
    station.segment = segment;
    return station;
}


var Observer = function(notify, notifyRemove) {
    return {
        notify: notify,
        notifyRemove: notifyRemove,
    }
};


var Map = {
    Map: function() {
        this.tracks = [];
        return this;
    },
    createTrack: function() {
        var newTrack = createTrack();
        this.tracks.push(newTrack);
        return newTrack;
    },
    draw: function() {
        project.clear();
        for (var i in this.tracks) {
            this.tracks[i].draw();
        }
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
    }
};


function createMap() {
    var observable = Object.create(Observable).Observable();
    var map = Object.assign(observable, Map);
    map = map.Map();
    return map;
}


var Track = {
    Track: function() {
        this.stations = [];
        this.stationsMinor = [];
        this.segmentStyle = styles.createSegmentStyle();
        this.segments = [];
        this.id = uuidv4();
        return this;
    },
    createStation: function(position, previousStation) {
    	var station = createStation(position);
        if (this.stations.length > 0) {
            if (!previousStation) {
                previousStation = this.lastAddedStation();
            }
            var segment = createSegment(previousStation, station, this.segmentStyle);
            this.segments.push(segment);
        }
        this.stations.push(station);
        console.log('create station', station.id);
        return station;
    },
    createStationMinor: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
    	var station = createStationMinor(position, segment);
        this.stationsMinor.push(station);
        this.draw();
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
            this.stationsMinor[i].draw();
        }
        this.notifyAllObservers(this);
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
        this.draw();
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
};


function createTrack() {
    var observable = Object.create(Observable).Observable();
    var track = Object.assign(observable, Track);
    track = track.Track();
    return track;
}


var Segment = {
    Segment: function(stationA, stationB, style) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.style = style;
        this.stationsMinor = [];
        this.id = uuidv4();
        this.paths = [];
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
            this.unselect();
        } else {
            this.select();
        }
    },
    select: function() {
        this.isSelected = true;
        for (var i in this.paths){
            this.paths[i].strokeColor = "green";
        }
    },
    unselect: function() {
        this.isSelected = false;
        for (var i in this.paths){
            this.paths[i].strokeColor = this.style.strokeColor;
        }
    },
    createPath: function() {
        var path = new Path();
        this.paths.push(path);
        path.strokeColor = this.style.strokeColor;
        path.strokeWidth = this.style.strokeWidth;
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.fullySelected = DisplaySettings.isDebug;
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
        var needsArc = Math.abs(stationVector.x) > minStraight+arcRadius*2 && Math.abs(stationVector.y) > minStraight+arcRadius*2;
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
            pathBegin.add(this.begin());
            pathBegin.add(beginPoint0);

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
            pathEnd.add(arcEnd + arcEndRel.normalize()*arcRadius*2);
            pathEnd.add(this.end());
        } else {
            var pathMiddle = this.createPath();
            this.pathsStraight.push(pathMiddle);
            pathMiddle.add(this.begin());
            pathMiddle.add(this.end());
            pathMiddle.smooth();
        }

        if (DisplaySettings.isDebug) {
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
    var observable = Object.create(Observable).Observable();
    segment = Object.assign(observable, Segment);
    segment = segment.Segment(stationA, stationB, style);
    return segment;
}


module.exports = {
    createStation: createStation,
    createStationMinor: createStationMinor,
    createSegment: createSegment,
    createMap: createMap,
    DisplaySettings: DisplaySettings,
    Observer: Observer,
    snapPosition: snapPosition,
};

/***/ }),
/* 2 */
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(1);


function createStationContextMenu(stationElementId, track) {
    $.contextMenu({
        selector: '#' + stationElementId,
        trigger: 'none',
        callback: function(key, options) {
            if (key === "delete") {
                var stationId = $(options.selector).data('station-id');
                track.removeStation(stationId);
            }
        },
        items: {
            "delete": {name: "Delete", icon: "delete"},
        }
    });
}


function createSegmentContextMenu(segmentElementId, track) {
    $.contextMenu({
        selector: '#' + segmentElementId,
        trigger: 'none',
        callback: function(key, options) {
            var segmentId = $(options.selector).data('segment-id');
            if (key === "create minor station") {
                var position = $(options.selector).data('position');
                track.createStationMinor(position, segmentId);
            } else if (key === "switchdirection") {
                var stationId = $(options.selector).data('station-id');
                var segment = track.findSegment(segmentId);
                segment.switchDirection();
                track.draw();
            }
        },
        items: {
            "create minor station": {name: "Add minor station", icon: "new"},
            "switchdirection": {name: "Switch direction", icon: ""},
        }
    });
}


module.exports = {
    createStationContextMenu: createStationContextMenu,
    createSegmentContextMenu: createSegmentContextMenu,
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);
var contextmenu = __webpack_require__(3);


function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}


function showSegmentContextMenu(segmentId, position) {
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
}


function createStationElement(station, track) {
	var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")
    var stationElement = $("#" + stationElementId);

	contextmenu.createStationContextMenu(stationElementId, track);
    updateElementPosition(stationElement, station);
    updateStyle();
    createStationObserver();

    function updateElementPosition(stationElement, station) {
	    stationElement.css('top', (station.position.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (station.position.x - stationElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            stationElement.css('border-width', '1px');
        } else {
            stationElement.css('border-width', '0px');
        }
    }

    function createStationObserver() {
        var stationObserver = new core.Observer(
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
}


function createSegmentElements(track) {
    console.log('createSegmentElements');
    $(".segment").empty();
    for (var i in track.segments) {
        var segment = track.segments[i];
        createSegmentElement(segment, track);
    }
}


function createSegmentElement(segment, track) {
	var segmentElementId = "segment-" + segment.id;
	$("#overlay").append("<div class=\"segment\" id=\"" + segmentElementId + "\" data-segment-id=\"" + segment.id + "\"></div>")
    var segmentElement = $("#" + segmentElementId);

	contextmenu.createSegmentContextMenu(segmentElementId, track);
    updateSegmentElementPosition(segmentElement, segment);
    updateStyle();
    createSegmentObserver();

    function updateSegmentElementPosition(segmentElement, segment) {
	    segmentElement.css('top', (segment.center().y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segment.center().x - segmentElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            segmentElement.css('border-width', '1px');
        } else {
            segmentElement.css('border-width', '0px');
        }
    }

    function createSegmentObserver() {
        var segmentObserver = new core.Observer(
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
}


module.exports = {
    createStationElement: createStationElement,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);

//
// function showStations(track) {
//     var sideBar = $("#sidebar");
//     sideBar.empty();
//     for (var i in track.stations) {
//         var station = track.stations[i];
//         sideBar.append("<span><small>Station " + station.id + "</small></span>");
//         sideBar.append("<span><small> (" + station.position.x + ", " + station.position.y + ")</small></span>");
//         sideBar.append("<br/>");
//     }
// }


function showTracks(tracks) {
    var sideBar = $("#sidebar");
}


function notifyNewStation(station, track) {
    var stationObserver = new core.Observer(
        function(station) {
            // showStations(track);
        },
        function(station) {
            // showStations(track);
        }
    );
    station.registerObserver(stationObserver);
}


module.exports = {
    notifyNewStation: notifyNewStation
};

/***/ }),
/* 6 */
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


module.exports = {
    setMajorStationButtonAction: setMajorStationButtonAction,
    setMinorStationButtonAction: setMinorStationButtonAction,
    setSelectButtonAction: setSelectButtonAction,
    setNewTrackButtonAction: setNewTrackButtonAction
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);
var interaction = __webpack_require__(4);
var sidebar = __webpack_require__(5);
var toolbar = __webpack_require__(6);


var map = core.createMap();

var currentTrack = map.createTrack();
var segmentClicked = null;
var selectedStation = null;


var modes = {
    majorstation: "majorstation",
    minorstation: "minorstation",
    select: "select"
};

var mode = modes.majorstation;


var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 3
};


function setCurrentTrack(track) {
    if (!track) {
        return;
    }
    currentTrack = track;
}


function getStationClicked(hitResult) {
    var path = hitResult.item;
    var result = map.findStationByPathId(path.id);
    var stationClicked = result.station;
    setCurrentTrack(result.track);
    return stationClicked;
}


function getSegmentClicked(hitResult) {
    var path = hitResult.item;
    var segments = path.segments;
    var result = map.findSegmentByPathId(segments[0].path.id);
    var segmentClicked = result.segment;
    setCurrentTrack(result.track);
    return segmentClicked;
}


function onRightClick(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        return;
    }

    var stationClicked = getStationClicked(hitResult);
    if (stationClicked) {  // right mouse
        interaction.showStationContextMenu(stationClicked.id);
        return;
    }
    var segmentClicked = getSegmentClicked(hitResult);
    if (segmentClicked) {  // right mouse
        interaction.showSegmentContextMenu(segmentClicked.id);
        return;
    }
}


function onClickMajorStationMode(event) {
    console.log('onClickMajorStation');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            console.log('station clicked');
            stationClicked.select();
            selectedStation = stationClicked;
        }
    } else {
        var stationNew = currentTrack.createStation(event.point, selectedStation);
        var position = core.snapPosition(currentTrack, stationNew, event.point);
        stationNew.setPosition(position);
        selectedStation = stationNew;
        sidebar.notifyNewStation(stationNew, currentTrack);
        interaction.createStationElement(stationNew, currentTrack);
        interaction.createSegmentElements(currentTrack);
        map.draw();
    }
}


function onClickMinorStationMode(event) {
    console.log('onClickMinorStationMode');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        if (hitResult.type === "stroke" || path) {
            console.log('stroke hit');
            segmentClicked = getSegmentClicked(hitResult);
            if (segmentClicked) {
                currentTrack.createStationMinor(event.point, segmentClicked.id);
                map.draw();
            } else {
                console.log('warning: no segment clicked');
            }
        }
    }
}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            stationClicked.toggleSelect();
            selectedStation = stationClicked;
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
            segmentClicked.toggleSelect();
            return;
        }
    }
}


function onMouseDown(event) {
    if (event.event.which === 3) {  // right mouse
        onRightClick(event);
        return;
    }

    if (mode === modes.majorstation) {
        onClickMajorStationMode(event);
    } else if (mode === modes.minorstation) {
        selectedStation = null;
        onClickMinorStationMode(event);
    } else if (mode === modes.select) {
        onClickSelectMode(event);
    }
}


function onMouseDrag(event) {
	if (selectedStation) {
	    var position = core.snapPosition(currentTrack, selectedStation, event.point);
        selectedStation.setPosition(position);
	    map.draw();
	}
}


function onKeyDown(event) {
    if (event.key === 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
        map.draw();
        if (core.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
            $(".segment").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
            $(".segment").css('border-width', '0px');
        }
    }
}


function initialiseToolbarActions() {
    console.log('initialiseToolbarActions');
    function majorStationButtonClicked() {
        console.log('major station drawing selected');
        mode = modes.majorstation;
    }

    function minorStationButtonClicked() {
        console.log('minor station drawing selected');
        mode = modes.minorstation;
    }

    function selectButtonClicked() {
        console.log('selection mode selected');
        mode = modes.select;
    }

    function newTrackButtonClicked() {
        console.log('new track button clicked');
        var newTrack = map.createTrack();
        var segmentStyle = styles.createSegmentStyle();
        segmentStyle.strokeColor = "blue";
        newTrack.segmentStyle = segmentStyle;
        currentTrack = newTrack;
    }

    toolbar.setMajorStationButtonAction(majorStationButtonClicked);
    toolbar.setMinorStationButtonAction(minorStationButtonClicked);
    toolbar.setSelectButtonAction(selectButtonClicked);
    toolbar.setNewTrackButtonAction(newTrackButtonClicked);
}


$(initialiseToolbarActions);


tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;
tool.onKeyDown = onKeyDown;






/***/ })
/******/ ]);