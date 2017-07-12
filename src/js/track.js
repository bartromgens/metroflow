var core = require("./core.js");
var metrosegment = require("./segment.js");
var metrostation = require("./station.js");


var Track = {
    Track: function() {
        this.stations = [];
        this.stationsMinor = [];
        this.segmentStyle = styles.createSegmentStyle();
        this.segments = [];
        this.id = core.uuidv4();
        return this;
    },
    createStation: function(position, previousStation) {
        var station = metrostation.createStation(position, null);
        if (this.stations.length > 0) {
            if (!previousStation) {
                previousStation = this.lastAddedStation();
            }
            var segment = metrosegment.createSegment(previousStation, station, this.segmentStyle);
            this.segments.push(segment);
        }
        this.stations.push(station);
        console.log('create station', station.id);
        return station;
    },
    createStationMinor: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
        var station = metrostation.createStationMinor(position, segment);
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
    var observable = Object.create(core.Observable).Observable();
    var track = Object.assign(observable, Track);
    track = track.Track();
    return track;
}


module.exports = {
    createTrack: createTrack,
};