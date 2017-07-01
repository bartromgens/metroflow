require("paper");

var strokeWidth = 6;
var stationRadius = 1.3*strokeWidth;
var strokeColor = 'red';
var isDebug = false;


var StationStyle = {
    strokeColor: "black",
    strokeWidth: 6,
    fillColor: "white",
    stationRadius: 1.3*6,
    fullySelected: isDebug,
}

var Station = {
    Station: function(point) {
        console.log('new station for point', point);
        this.point = point;
        return this;
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
            this.segments[i].draw();
        }
        for (var i in this.stations) {
            this.stations[i].draw();
        }
    }
}

function createTrack() {
    var track = Object.create(Track);
    return track;
}

var Segment = {
    Segment: function(start, end) {
        console.log('new segment', start, end);
        this.start = start;
        this.end = end;
        return this;
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

    draw: function() {
        console.log('addLine');
        var minStraight = 50;
        var begin = this.start;
        var end = this.end;
        console.log('begin', begin);
        console.log('end', end);
        var path = this.createPath();
        var stationVector = end-begin;
        var maxDistance = Math.min(Math.abs(stationVector.x), Math.abs(stationVector.y)) - minStraight;
        var straightBegin = Math.abs(stationVector.y) - maxDistance;
        var straightEnd = Math.abs(stationVector.x) - maxDistance;
        console.log('stationVector.y', stationVector.y);
        console.log('maxDistance', maxDistance);
        console.log('straightBegin', straightBegin);
        console.log('straightEnd', straightEnd);
        straightBegin = Math.max(straightBegin, minStraight);
        straightEnd = Math.max(straightEnd, minStraight);
        var center = (stationVector)/2.0 + begin;
        var arcBegin = begin + new Point(0, straightBegin)*Math.sign(stationVector.y);
        var arcEnd = end - new Point(straightEnd, 0)*Math.sign(stationVector.x);
        var debugPointRadius = 4;
        path.add(begin);
        if (Math.abs(stationVector.x) > minStraight && Math.abs(stationVector.y) > minStraight) {
            path.add(arcBegin);
            path.add(arcEnd);
        }
        if (isDebug) {
            var centerCircle = new Path.Circle(center, debugPointRadius);
            centerCircle.strokeWidth = 1;
            centerCircle.strokeColor = 'blue';
            centerCircle.fillColor = 'blue';
            var arcBeginCircle = new Path.Circle(arcBegin, debugPointRadius);
            arcBeginCircle.style = centerCircle.style;
            arcBeginCircle.fillColor = 'black';
            var arcEndCircle = new Path.Circle(arcEnd, debugPointRadius);
            arcEndCircle.style = centerCircle.style;
            arcEndCircle.fillColor = 'green';
        }
        path.add(end);
        return path;
    },
}

function createSegment(start, end) {
    console.log('createSegment()');
    var segment = Object.create(Segment).Segment(start, end);
    return segment;
}

module.exports = {
    createStation: createStation,
    StationStyle: StationStyle,
    createSegment: createSegment,
    createTrack: createTrack,
};