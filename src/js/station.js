require("paper");
core = require("./core.js");
styles = require("./styles.js");


var Station = {
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


var StationPainter = {
    draw: function() {
        this.path = new Path.Circle(this.position, this.style.stationRadius);
        if (this.isSelected) {
            this.path.strokeColor = this.style.selectionColor;
        } else {
            this.path.strokeColor = this.style.strokeColor;
        }
        this.path.strokeWidth = this.style.strokeWidth;
        this.path.fillColor = this.style.fillColor;
        this.path.bringToFront();
    },
};


var StationMinorPainter = {
    draw: function(segment) {
        var minorStationSize = this.style.minorStationSize;
        this.path = new Path.Line(this.position, this.position + this.normalUnit*minorStationSize);
        this.path.strokeColor = this.style.strokeColor;
        this.path.strokeWidth = this.style.strokeWidth;
        // this.path.fillColor = this.style.fillColor;
    },
    direction: function() {
        return (this.path.lastSegment.point - this.path.firstSegment.point).normalize();
    }
};


var StationPositionSegment = {
    updatePosition: function(segment, orderNr) {
        var nStations = segment.stationsMinor.length + 1; // including main station
        var totalLength = segment.lengthStraight();
        var distanceBetweenStations = totalLength/nStations;
        var distanceStation = distanceBetweenStations * (orderNr+1);
        var currentLength = 0;
        var lengthDone = 0;
        var path = null;
        for (var i in segment.pathsStraight) {
            currentLength += segment.pathsStraight[i].length;
            if (currentLength > distanceStation) {
                path = segment.pathsStraight[i];
                break;
            }
            lengthDone += currentLength;
        }
        var middleLine = path.lastSegment.point - path.firstSegment.point;
        this.position = path.firstSegment.point + middleLine.normalize()*(distanceStation-lengthDone);
        this.normalUnit = path.getNormalAt(path.length/2.0);
        return this.position;
    }
};


var StationPositionFree = {
    updatePosition: function() {
        return this.position;
    }
};


function createStationFree(position, style) {
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionFree, StationPainter);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationSegment(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegment, StationPainter);
    station = station.Station(position, style);
    return station;
}


function createStationMinor(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(core.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegment, StationMinorPainter);
    station = station.Station(position, style);
    station.stationA = stationA;
    station.stationB = stationB;
    return station;
}


module.exports = {
    createStationFree: createStationFree,
    createStationSegment: createStationSegment,
    createStationMinor: createStationMinor,
};