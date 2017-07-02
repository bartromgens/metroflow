require("paper");

var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var strokeColor = "red";
var fillColor = "white"

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

var Station = {
    Station: function(position) {
        console.log('new station for point', position);
        this.position = position;
        this.id = uuidv4().substring(0,8);
        this.observers = [];
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
        this.circle.strokeColor = StationStyle.selectionColor;
    },
    unselect: function() {
        this.isSelected = false;
        this.circle.strokeColor = StationStyle.strokeColor;
    },
    setPosition: function(position) {
        this.position = position;
        this.notifyAllObservers();
    },
    draw: function() {
        this.circle = new Path.Circle(this.position, StationStyle.stationRadius);
        this.circle.strokeColor = StationStyle.strokeColor;
        this.circle.strokeWidth = StationStyle.strokeWidth;
        this.circle.fillColor = StationStyle.fillColor;
//        this.circle.fullySelected = DisplaySettings.isDebug;
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

function createStation(point) {
    var station = Object.create(Station).Station(point);
    return station;
}

var StationObserver = function(notify, notifyRemove) {
    return {
        notify: notify,
        notifyRemove: notifyRemove,
    }
}

var Track = {
    Track: function() {
        this.stations = [];
        this.segments = [];
        this.id = uuidv4();
        return this;
    },
    createStation: function(position) {
    	var station = createStation(position);
        this.stations.push(station);
        this.draw();
        return station;
    },
    draw: function() {
        console.log('draw track');
        this.createSegments();
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
    },
    createSegments: function() {
        this.segments = [];
        for (var i = 1; i < this.stations.length; ++i) {
            var previousStation = this.stations[i-1];
            var station = this.stations[i];
    	    var segment = createSegment(previousStation.position, station.position);
	        this.segments.push(segment);
        }
    },
    findStationByPathId: function(id) {
        for (var i in this.stations) {
            var stationId = this.stations[i].circle.id;
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
}

function createTrack() {
    var track = Object.create(Track).Track();
    return track;
}

var Segment = {
    Segment: function(begin, end) {
        this.begin = begin;
        this.end = end;
        this.id = uuidv4();
        this.paths = [];
        this.isSelected = false;
        return this;
    },
    direction: function() {
        return this.end - this.begin;
    },
    center: function() {
        return this.begin + (this.end - this.begin)/2;
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
//        console.log('addLine');
        this.paths = [];
        var minStraight = 40;
        var arcRadius = 10.0;
        var stationVector = this.end - this.begin;
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
            var arcEnd = this.end - arcEndRel;
            var arcBegin = this.begin + arcBeginRel;
            var beginPoint0 = arcBegin - arcBeginRel.normalize()*arcRadius*2;
            var beginPoint1 = arcBegin - arcBeginRel.normalize()*arcRadius;
            var beginPoint2 = arcBegin + (arcEnd-arcBegin).normalize()*arcRadius;
            var beginPoint3 = arcBegin + (arcEnd-arcBegin).normalize()*arcRadius*2;
            var centerArc1 = beginPoint1 + (beginPoint2-beginPoint1)/2;
            var beginCenter = centerArc1 + (arcBegin-centerArc1)/1.7;

            var pathBegin = this.createPath();
            pathBegin.add(this.begin);
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
            pathEnd.add(arcEnd + arcEndRel.normalize()*arcRadius*2);
            pathEnd.add(this.end);
        } else {
            var path = this.createPath();
            path.add(this.begin);
            path.add(this.end);
            path.smooth();
        }

        if (DisplaySettings.isDebug) {
            var debugPointRadius = 4;
            var center = (stationVector)/2.0 + this.begin;
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
//        path.fullySelected = true;
//        return path;
    },
}

function createSegment(begin, end) {
    var segment = Object.create(Segment).Segment(begin, end);
    return segment;
}

module.exports = {
    createStation: createStation,
    createSegment: createSegment,
    createTrack: createTrack,
    DisplaySettings: DisplaySettings,
    StationObserver: StationObserver,
};