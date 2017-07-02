require("paper");

var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var strokeColor = "red";
var fillColor = "white"
var isDebug = false;

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
    fullySelected: isDebug,
}

var Station = {
    Station: function(point) {
        console.log('new station for point', point);
        this.point = point;
        return this;
    },
    isSelected: false,
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
    draw: function() {
        this.circle = new Path.Circle(this.point, StationStyle.stationRadius);
        this.circle.strokeColor = StationStyle.strokeColor;
        this.circle.strokeWidth = StationStyle.strokeWidth;
        this.circle.fillColor = StationStyle.fillColor;
        this.circle.fullySelected = StationStyle.isDebug;
    }
}

function createStation(point) {
    var station = Object.create(Station).Station(point);
    return station;
}

var Track = {
    stations: [],
    segments: [],
    draw: function() {
        console.log('draw track');
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
    findStation: function(id) {
        for (var i in this.stations) {
            var stationId = this.stations[i].circle.id;
            console.log(stationId);
            if (this.stations[i].circle.id === id) {
                return this.stations[i];
            }
        }
        return null;
    }
}

function createTrack() {
    var track = Object.create(Track);
    return track;
}

var Segment = {
    Segment: function(begin, end) {
        console.log('new segment', begin, end);
        this.begin = begin;
        this.end = end;
        return this;
    },
    direction: function() {
        return this.end - this.begin;
    },
    createPath: function() {
        var path = new Path();
        path.strokeColor = strokeColor;
        path.strokeWidth = strokeWidth;
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.fullySelected = isDebug;
        return path;
    },
    draw: function(previous) {
        console.log('addLine');
        var minStraight = 60;
        var arcRadius = 15.0;
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

        if (isDebug) {
            var debugPointRadius = 4;
            var center = (stationVector)/2.0 + this.begin;
            var centerCircle = new Path.Circle(center, debugPointRadius);
            centerCircle.strokeWidth = 1;
            centerCircle.strokeColor = 'blue';
            centerCircle.fillColor = 'blue';
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
    console.log('createSegment()');
    var segment = Object.create(Segment).Segment(begin, end);
    return segment;
}

module.exports = {
    StationStyle: StationStyle,
    createStation: createStation,
    createSegment: createSegment,
    createTrack: createTrack,
};