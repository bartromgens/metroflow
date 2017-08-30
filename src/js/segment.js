util = require("./util.js");

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
