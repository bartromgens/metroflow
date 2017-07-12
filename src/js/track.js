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
    stationSegments: function(station) {
        var segments = [];
        segments.push(this.segmentToStation(station));
        segments.push(this.segmentFromStation(station));
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
    segmentFromStation: function(station) {
        for (var i in this.segments) {
            var segment = this.segments[i];
            if (segment.stationA.id === station.id) {
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
    createText: function(station, positionRelative) {
        var text = new PointText(station.position + positionRelative);
        text.justification = 'left';
        text.fillColor = 'black';
        text.content = station.name;
        return text;
    },
    preventIntersectionSegments: function(text, station, segments, positions) {
        if (!segments) {
            return;
        }
        var paths = [];
        for (var i in segments) {
            for (var j in segments[i].paths) {
                paths.push(segments[i].paths[j]);
            }
        }
        var positionsTried = 0;
        var intersects = true;
        while (intersects && positionsTried < positions.length) {
            intersects = false;
            for (var j in paths) {
                var path = paths[j];
                intersects = text.intersects(path);
                if (intersects) {
                    var textOld = text;
                    positionsTried++;
                    text = this.createText(station, positions[positionsTried]);
                    text.fontSize = textOld.fontSize;
                    textOld.remove();
                    break;
                }
            }
        }
    },
    drawStationNames: function() {
        var fontSize = 20;
        this.drawMajorStationNames(fontSize);
        fontSize = 15;
        this.drawMinorStationNames(fontSize);
    },
    drawMajorStationNames: function(fontSize) {
        for (var i in this.stations) {
            var station = this.stations[i];
            var positions = [];
            var stationRadius = station.style.stationRadius + station.style.strokeWidth;
            positions.push(new Point(stationRadius, fontSize / 4.0));
            var text = this.createText(station, positions[0]);
            text.fontSize = fontSize;
            positions.push(new Point(-stationRadius-text.bounds.width, fontSize / 4.0));
            positions.push(new Point(0, -stationRadius*1.2));
            positions.push(new Point(-text.bounds.width, -stationRadius*1.2));
            positions.push(new Point(0, stationRadius*2.2));
            positions.push(new Point(-text.bounds.width, stationRadius*2.2));
            var segmentTo = this.segmentToStation(station);
            var segmentFrom = this.segmentFromStation(station);
            var segments = [];
            if (segmentTo) {
                segments.push(segmentTo);
            }
            if (segmentFrom) {
                segments.push(segmentFrom);
            }
            this.preventIntersectionSegments(text, station, segments, positions);
        }
    },
    drawMinorStationNames: function(fontSize) {
        for (var i in this.stationsMinor) {
            var station = this.stationsMinor[i];
            var text = this.createText(station, station.direction()*station.style.minorStationSize*1.1);
            text.fontSize = fontSize;
        }
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