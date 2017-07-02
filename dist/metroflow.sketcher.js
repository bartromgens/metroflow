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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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

var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var strokeColor = "red";
var fillColor = "white"

var minorStationSize = strokeWidth*2;

var DisplaySettings = {
    isDebug: false,
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


var StationStyle = {
    strokeColor: "black",
    strokeWidth: strokeWidth/2,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: "green",
    fullySelected: false,
}

var Observable = {
    Observable: function() {
        this.observers = [];
        return this;
    },
    registerObserver: function(observer) {
        var index = this.observers.indexOf(observer);
        if (index == -1) {
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
        };
    },
    notifyBeforeRemove: function() {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].notifyRemove(this);
        };
    },
}

var BaseStation = {
    Station: function(position) {
        console.log('new station for point', position);
        this.position = position;
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
        this.path.strokeColor = StationStyle.selectionColor;
    },
    unselect: function() {
        this.isSelected = false;
        this.path.strokeColor = StationStyle.strokeColor;
    },
    setPosition: function(position) {
        this.position = position;
        this.notifyAllObservers();
    },
}

var Station = {
    draw: function() {
        this.path = new Path.Circle(this.position, StationStyle.stationRadius);
        this.path.strokeColor = StationStyle.strokeColor;
        this.path.strokeWidth = StationStyle.strokeWidth;
        this.path.fillColor = StationStyle.fillColor;
//        this.circle.fullySelected = DisplaySettings.isDebug;
    },
}

var StationMinor = {
    draw: function() {
        var position = this.segment.calcStationPosition(this);
        this.path = new Path.Line(position.centerPointOnLine, position.centerPointOnLine + position.normalUnitVector*minorStationSize);
        this.path.strokeColor = strokeColor;
        this.path.strokeWidth = strokeWidth;
        this.path.fillColor = StationStyle.fillColor;
    },
}

function createStation(position) {
    var observable = Object.create(Observable).Observable();
    station = Object.assign(observable, BaseStation, Station);
    station = station.Station(position);
    return station;
}

function createStationMinor(position, segment) {
    var observable = Object.create(Observable).Observable();
    station = Object.assign(observable, BaseStation, StationMinor);
    station = station.Station(position);
    segment.stationsMinor.push(station);
    station.segment = segment;
    return station;
}

var Observer = function(notify, notifyRemove) {
    return {
        notify: notify,
        notifyRemove: notifyRemove,
    }
}

var Track = {
    Track: function() {
        this.stations = [];
        this.stationsMinor = [];
        this.segments = [];
        this.id = uuidv4();
        return this;
    },
    createStation: function(position) {
    	var station = createStation(position);
        if (this.stations.length > 0) {
            var previousStation = this.stations[this.stations.length - 1];
            var segment = createSegment(previousStation, station);
            this.segments.push(segment);
        }
        this.stations.push(station);
        this.draw();
        return station;
    },
    createStationMinor: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
    	var station = createStationMinor(position, segment);
        this.stationsMinor.push(station);
        this.draw();
        return station;
    },
    draw: function() {
//        console.log('draw track');
        project.clear();
        for (var i in this.segments) {
            var previous = null;
            if (i > 0) {
                previous = this.segments[i-1];
            }
            this.segments[i].draw(previous);
        }
        for (var i in this.stations) {
            this.stations[i].draw();
        }
        for (var i in this.stationsMinor) {
            this.stationsMinor[i].draw();
        }
        this.notifyAllObservers(this);
    },
//    createSegments: function() {
//        this.segments = [];
//        for (var i = 1; i < this.stations.length; ++i) {
//            var previousStation = this.stations[i-1];
//            var station = this.stations[i];
//    	    var segment = createSegment(previousStation, station);
//	        this.segments.push(segment);
//        }
//    },
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
            var stationId = this.stations[i].id;
            if (stationId === id) {
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
            var segmentId = this.segments[i].id;
            if (segmentId === id) {
                return this.segments[i];
            }
        }
        return null;
    },
}

function createTrack() {
    var observable = Object.create(Observable).Observable();
    track = Object.assign(observable, Track);
    var track = track.Track();
    return track;
}

var Segment = {
    Segment: function(stationA, stationB) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.stationsMinor = [];
        this.id = uuidv4();
        this.paths = [];
        this.pathsStraight = [];
        this.pathBegin = null;
        this.pathMiddle = null;
        this.pathEnd = null;
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
            this.paths[i].strokeColor = StationStyle.selectionColor;
        }
    },
    unselect: function() {
        this.isSelected = false;
        for (var i in this.paths){
            this.paths[i].strokeColor = strokeColor;
        }
    },
    createPath: function() {
        var path = new Path();
        this.paths.push(path);
        path.strokeColor = strokeColor;
        path.strokeWidth = strokeWidth;
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.fullySelected = DisplaySettings.isDebug;
        return path;
    },
    calcStationPosition: function(station) {
        var pos = this.stationsMinor.indexOf(station);
        var nStations = this.stationsMinor.length + 1 // including main station
        var distanceBetweenStations = this.lengthStraight()/nStations;
        var distanceStation = distanceBetweenStations * (pos+1);
        var currentLength = 0;
        var path = null;
        for (var i in this.pathsStraight) {
            currentLength += this.pathsStraight[i].length;
            if (currentLength > distanceStation) {
                path = this.pathsStraight[i];
                break;
            }
            lengthDone = currentLength;
        }
        var middleLine = path.lastSegment.point - path.firstSegment.point;
        var centerPointOnLine = path.firstSegment.point + middleLine.normalize()*(distanceStation-lengthDone);
        return {centerPointOnLine: centerPointOnLine, normalUnitVector: path.getNormalAt(path.length/2.0)};
    },
    draw: function(previous) {
        this.paths = [];
        this.pathsStraight = [];
        var minStraight = 40;
        var arcRadius = 10.0;
        var stationVector = this.end() - this.begin();
        var maxDistance = Math.min(Math.abs(stationVector.x), Math.abs(stationVector.y)) - minStraight;
        var straightBegin = Math.abs(stationVector.y) - maxDistance;
        var straightEnd = Math.abs(stationVector.x) - maxDistance;
        straightBegin = Math.max(straightBegin, minStraight);
        straightEnd = Math.max(straightEnd, minStraight);
        var arcBeginRel = new Point(0, straightBegin)*Math.sign(stationVector.y);
        var arcEndRel = new Point(straightEnd, 0)*Math.sign(stationVector.x);
        if (previous && Math.abs(previous.direction().x) > Math.abs(previous.direction().y)) {
            arcBeginRel = new Point(straightEnd, 0)*Math.sign(stationVector.x);
            arcEndRel = new Point(0, straightBegin)*Math.sign(stationVector.y);
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
}

function createSegment(stationA, stationB) {
    console.log('createSegment');
    var observable = Object.create(Observable).Observable();
    segment = Object.assign(observable, Segment);
    segment = segment.Segment(stationA, stationB);
    return segment;
}

module.exports = {
    createStation: createStation,
    createStationMinor: createStationMinor,
    createSegment: createSegment,
    createTrack: createTrack,
    DisplaySettings: DisplaySettings,
    Observer: Observer,
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);


function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}


function showSegmentContextMenu(segmentId, position) {
    console.log('test', position);
    console.log($('#segment-' + segmentId));
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
    console.log('test');
}


function createStationContextMenu(stationElementId, track) {
    $.contextMenu({
        selector: '#' + stationElementId,
        trigger: 'none',
        callback: function(key, options) {
            if (key == "delete") {
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
            console.log('options', options);
            if (key == "create minor station") {
                var segmentId = $(options.selector).data('segment-id');
                var position = $(options.selector).data('position');
                track.createStationMinor(position, segmentId);
            }
        },
        items: {
            "create minor station": {name: "create minor station", icon: "new"},
        }
    });
}


function createStationElement(station, track) {
	var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")

	createStationContextMenu(stationElementId, track);

    var stationElement = $("#" + stationElementId);

    function updateElementPosition(stationElement, station) {
	    stationElement.css('top', (station.position.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (station.position.x - stationElement.height()/2) + 'px');
    }
    updateElementPosition(stationElement, station);

    if (core.DisplaySettings.isDebug) {
        stationElement.css('border-width', '1px');
    } else {
        stationElement.css('border-width', '0px');
    }

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

	createSegmentContextMenu(segmentElementId, track);

    var segmentElement = $("#" + segmentElementId);

    function updateSegmentElementPosition(segmentElement, segment) {
	    segmentElement.css('top', (segment.center().y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segment.center().x - segmentElement.height()/2) + 'px');
    }
    updateSegmentElementPosition(segmentElement, segment);

    if (core.DisplaySettings.isDebug) {
        segmentElement.css('border-width', '1px');
    } else {
        segmentElement.css('border-width', '0px');
    }

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

module.exports = {
    createStationElement: createStationElement,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);

function showStations(track) {
    $("#sidebar").empty();
    for (var i in track.stations) {
        var station = track.stations[i];
        $("#sidebar").append("<span><small>Station " + station.id + "</small></span>");
        $("#sidebar").append("<span><small> (" + station.position.x + ", " + station.position.y + ")</small></span>");
        $("#sidebar").append("<br/>");
    }
}

module.exports = {
    showStations: showStations,
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
var core = __webpack_require__(1);
var interaction = __webpack_require__(2);
var sidebar = __webpack_require__(3);

var track = core.createTrack();
var snapDistance = 60;

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 10
};

var stationClicked = null;
var segmentClicked = null;

function onMouseDown(event) {
    console.log('key', event.event.which);

	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult) {
		var path = hitResult.item;
		console.log('hitresult type', hitResult.type);
		console.log('hitResult.item;', hitResult.item);
        stationClicked = track.findStationByPathId(path.id);
        if (hitResult.type == "stroke") {
            var segments = hitResult.item.segments;
            segmentClicked = track.findSegmentByPathId(segments[0].path.id);
            console.log('segmentClicked', segmentClicked);
        }
        if (stationClicked) {
            if (event.event.which == 3) {  // right mouse
                interaction.showStationContextMenu(stationClicked.id);
                return;
            }
            stationClicked.toggleSelect();
        } else if (segmentClicked) {
            console.log('segment clicked');
            if (event.event.which == 3) {  // right mouse
                interaction.showSegmentContextMenu(segmentClicked.id, event.point);
                return;
            }
            segmentClicked.toggleSelect();
        }
		if (hitResult.type == 'segment') {
		    console.log('segment found');
			segment = hitResult.segment;
        }
		return;
	}

	var position = new Point(event.point.x, event.point.y);
	if (track.stations.length > 0) {
	    var previousStation = track.stations[track.stations.length-1];
	    if (Math.abs(previousStation.position.x - position.x) < snapDistance) {
	        position.x = previousStation.position.x;
	    }
	    if (Math.abs(previousStation.position.y - position.y) < snapDistance) {
	        position.y = previousStation.position.y;
	    }
	}

    var stationNew = track.createStation(position);
    registerForSidebar(stationNew);
	interaction.createStationElement(stationNew, track);
	interaction.createSegmentElements(track);
	sidebar.showStations(track);
}

function onMouseDrag(event) {
//    console.log('mouseDrag');
	if (stationClicked) {
	    stationClicked.setPosition(stationClicked.position + event.delta);
	    track.draw();
	}
}

tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;


tool.onKeyDown = function(event) {
    if (event.key == 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
//        track.draw();
        if (core.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
            $(".segment").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
            $(".segment").css('border-width', '0px');
        }
    }
}

function registerForSidebar(station) {
    var stationObserver = new core.Observer(
        function(station) {
            sidebar.showStations(track);
        },
        function(station) {
            sidebar.showStations(track);
        }
    );
    station.registerObserver(stationObserver);
}


/***/ })
/******/ ]);