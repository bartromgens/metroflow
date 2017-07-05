require("paper");
styles = require("./styles.js");


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