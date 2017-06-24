
var strokeWidth = 8;
var stationRadius = 1.3*strokeWidth;
var strokeColor = 'red';
var isDebug = false;

project.currentStyle = {
	strokeColor: 'red',
//	fillColor: 'white',
	strokeWidth: strokeWidth
};

var stationA = new Point(100, 200);
var stationB = new Point(100, 300);
var stationC = new Point(100, 400);
var stationD = new Point(400, 600);
var stationE = new Point(500, 400);
addLine(stationA, stationB);
addLine(stationB, stationC);
addLine(stationC, stationD);
addLine(stationD, stationE);
addStation(stationA);
addStation(stationB);
addStation(stationC);
addStation(stationD);
addStation(stationE);


function createPath() {
    var path = new Path();
    path.strokeColor = strokeColor;
    path.strokeWidth = strokeWidth;
    path.strokeCap = 'round';
    path.strokeJoin = 'round';
    path.fullySelected = isDebug;
    return path;
}

function addLine(stationA, stationB) {
    console.log('addLine');
    var minStraight = 50;
    var begin = new Point(stationA); //+ new Point(0, stationRadius);
    var end = new Point(stationB); //- new Point(0, stationRadius);
    var path = createPath();
    var stationVector = end-begin;
    var maxDistance = Math.min(stationVector.x, stationVector.y) - minStraight;
    var straightBegin = (stationVector.y - maxDistance);
    var straightEnd = (stationVector.x - maxDistance);
    console.log('maxDistance', maxDistance);
    console.log('straightBegin', straightBegin);
    console.log('straightEnd', straightEnd);
    straightBegin = Math.max(straightBegin, minStraight);
    straightEnd = Math.max(straightEnd, minStraight);
    var center = (stationVector)/2.0 + begin;
    var arcBegin = begin + new Point(0, straightBegin);
    var arcEnd = end - new Point(straightEnd, 0);
    var debugPointRadius = 4;
    var centerCircle = new Path.Circle(center, debugPointRadius);
    centerCircle.strokeWidth = 1;
    centerCircle.strokeColor = 'blue';
    centerCircle.fillColor = 'blue';
    path.add(begin);
    if (stationVector.x > minStraight) {
        path.add(arcBegin);
        path.add(arcEnd);
        var arcBeginCircle = new Path.Circle(arcBegin, debugPointRadius);
        arcBeginCircle.style = centerCircle.style;
        var arcEndCircle = new Path.Circle(arcEnd, debugPointRadius);
        arcEndCircle.style = centerCircle.style;
    }
    path.add(end);
    return path;
}

function addStation(point) {
    var station = new Path.Circle(point, stationRadius);
    station.strokeColor = strokeColor;
    station.strokeWidth = strokeWidth;
    station.fillColor = 'white';
    station.fullySelected = isDebug;
}

