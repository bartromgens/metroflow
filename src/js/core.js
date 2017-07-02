require("paper");

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
        var middleLine = this.segment.pathMiddle.lastSegment.point - this.segment.pathMiddle.firstSegment.point;
        var centerPointOnLine = this.segment.pathMiddle.firstSegment.point + middleLine/2.0;
        var tangentVector = this.segment.pathMiddle.getNormalAt(this.segment.pathMiddle.length/2.0);
        this.path = new Path.Line(centerPointOnLine, centerPointOnLine + tangentVector*minorStationSize);
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
        this.id = uuidv4();
        this.paths = [];
        this.pathMiddle = null;
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
    draw: function(previous) {
        this.paths = [];
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

            this.pathMiddle = this.createPath();
            this.pathMiddle.add(beginPoint3);
            this.pathMiddle.add(endPoint0);

            var pathArc2 = this.createPath();
            pathArc2.add(endPoint0);
            pathArc2.add(endPoint1);
            pathArc2.add(endCenter);
            pathArc2.add(endPoint2);
            pathArc2.add(endPoint3);
            pathArc2.smooth();

            var pathEnd = this.createPath();
            pathEnd.add(arcEnd + arcEndRel.normalize()*arcRadius*2);
            pathEnd.add(this.end());
        } else {
            this.pathMiddle = this.createPath();
            this.pathMiddle.add(this.begin());
            this.pathMiddle.add(this.end());
            this.pathMiddle.smooth();
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