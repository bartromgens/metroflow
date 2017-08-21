require("paper");
util = require("./util.js");
styles = require("./styles.js");


var Station = {
    Station: function(position, style) {
        console.log('new station for point', position);
        this.position = position;
        this.offsetFactor = null;
        this.style = style;
        this.id = util.uuidv4().substring(0, 8);
        this.path = null;
        this.isSelected = false;
        this.name = "station";
        this.textPositionRel = null;
        this.doSnap = true;
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
    setPosition: function(position, segment) {
        this.doSetPosition(position, segment);
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


var StationPositionSegmentAuto = {
    doSetPosition: function(position, segment) {
        this.position = position;
    },
    updatePosition: function(segment, notifyObservers) {
        // console.log('=======================================');
        // console.log('StationPositionSegmentAuto.updatePosition');
        // console.log('this.position', this.position);
        // console.log('segment', segment);
        var offsetFactor = segment.getOffsetOf(this.position) / segment.length();
        var offset = segment.path.length * offsetFactor;
        this.position = segment.path.getPointAt(offset);
        var previousStationInfo = segment.getPreviousStation(this.position);
        // console.log('previousStationInfo', previousStationInfo.station.id);
        var offsetA = previousStationInfo.offset;
        var nextStationInfo = segment.getNextStation(this.position);
        var stationsAuto = segment.getStationsBetween(previousStationInfo.station, nextStationInfo.station);
        var nStations = stationsAuto.length;
        var offsetB = nextStationInfo.offset;
        // console.log('nextStationInfo', nextStationInfo.station.id);
        var totalLength = offsetB - offsetA;
        // console.log('totalLength', totalLength);
        // console.log('segment.length', segment.length());
        var distanceBetweenStations = totalLength/(nStations+1);
        var orderNr = stationsAuto.indexOf(this);
        var stationOffset = distanceBetweenStations * (orderNr+1) + offsetA;
        // console.log('stationsAuto', stationsAuto);
        // console.log('orderNr', orderNr);
        // console.log('stationOffset', stationOffset);
        var position = segment.path.getPointAt(stationOffset);
        console.assert(position);
        if (position) {
            this.position = position;
        }
        this.offsetFactor = segment.getOffsetOf(position) / segment.length();
        // console.log('segment.getOffsetOf(this.position)', segment.getOffsetOf(this.position));
        // console.log('offsetFactor', this.offsetFactor);
        this.normalUnit = segment.path.getNormalAt(stationOffset);
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


var StationPositionSegmentUser = {
    doSetPosition: function(position, segment) {
        this.offsetFactor = segment.getOffsetOf(position) / segment.length();
    },
    updatePosition: function(segment, notifyObservers) {
        var distanceStation = segment.path.length * this.offsetFactor;
        this.position = segment.path.getPointAt(distanceStation);
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


var StationPositionFree = {
    doSetPosition: function(position, segment) {
        this.position = position;
    },
    updatePosition: function(segment, notifyObservers) {
        if (notifyObservers) {
            this.notifyAllObservers();
        }
        return this.position;
    }
};


function createStationFree(position, style) {
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionFree, StationPainter);
    if (!style) {
        style = styles.createStationStyle();
    }
    station = station.Station(position, style);
    return station;
}


function createStationSegment(offsetFactor, style) {
    console.log('createStationMinor');
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentUser, StationPainter);
    station = station.Station(new Point(0, 0), style);
    station.offsetFactor = offsetFactor;
    station.doSnap = false;
    return station;
}


function createStationMinor(position, stationA, stationB, style) {
    console.log('createStationMinor');
    var observable = Object.create(util.Observable).Observable();
    var station = Object.assign(observable, Station, StationPositionSegmentAuto, StationMinorPainter);
    station = station.Station(position, style);
    station.stationA = stationA;
    station.stationB = stationB;
    station.name = "minor station";
    station.doSnap = false;
    return station;
}


module.exports = {
    createStationFree: createStationFree,
    createStationSegment: createStationSegment,
    createStationMinor: createStationMinor,
};