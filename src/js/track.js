require("paper");
var util = require("./util.js");
var metrosegment = require("./segment.js");
var metrostation = require("./station.js");
var metrostyles = require("./styles.js");


var Track = {
    Track: function() {
        this.segments = [];
        this.id = util.uuidv4();
        this.stations = [];
        this.stationsMajor = [];
        this.stationsMinor = [];
        this.segmentStyle = metrostyles.createSegmentStyle();
        this.stationStyle = metrostyles.createStationStyle();
        this.stationMinorStyle = metrostyles.createStationMinorStyle();
        this.stationMinorStyle.strokeColor = this.segmentStyle.strokeColor;
        return this;
    },
    setStationRadius: function(radius) {
        this.stationStyle.stationRadius = radius;
    },
    setStationStrokeWidth: function(strokeWidth) {
        this.stationStyle.strokeWidth = strokeWidth;
    },
    setSegmentStyle: function(style) {
        this.segmentStyle = style;
        this.stationMinorStyle.strokeWidth = this.segmentStyle.strokeWidth;
        this.stationMinorStyle.strokeColor = this.segmentStyle.strokeColor;
        this.stationMinorStyle.minorStationSize = this.segmentStyle.strokeWidth * 2.0;
    },
    setStationStyle: function(style) {
        this.stationStyle = style;
    },
    createStationFree: function(position, previousStation) {
        var station = metrostation.createStationFree(position, this.stationStyle);
        if (previousStation) {
            this.createSegment(previousStation, station)
        }
        this.stations.push(station);
        this.stationsMajor.push(station);
        console.log('create station', station.id);
        this.notifyAllObservers();
        return station;
    },
    createStationOnSegment: function(segment, offsetFactor) {
        var station = metrostation.createStationSegment(offsetFactor, this.stationStyle);
        this.stations.push(station);
        this.stationsMajor.push(station);
        segment.addStationUser(station);
        this.notifyAllObservers();
        return station;
    },
    createSegment: function(stationA, stationB) {
        console.log('track.createSegment', stationA.id, stationB.id);
        var segment = metrosegment.createSegment(stationA, stationB, this.segmentStyle);
        this.segments.push(segment);
        this.notifyAllObservers();
        return segment;
    },
    createStationMinorOnSegmentId: function(position, segmentId) {
        var segment = this.findSegment(segmentId);
        position = segment.path.getNearestPoint(position);
        return this.createStationMinor(position, segment);
    },
    createStationMinor: function(position, segment) {
        var station = metrostation.createStationMinor(position, segment.stationA, segment.stationB, this.stationMinorStyle);
        segment.addStationAuto(station);
        station.setPosition(position, segment);
        this.stations.push(station);
        this.stationsMinor.push(station);
        this.notifyAllObservers();
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
        if (this.stationsMajor.length === 0) {
            return null;
        }
        return this.stationsMajor[this.stationsMajor.length - 1];
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
    allPaths: function() {
        var paths = [];
        for (var i in this.segments) {
            paths.push(this.segments[i].path);
        }
        return paths;
    },
    draw: function(drawSettings) {
        // console.log('track.draw()');
        for (var i in this.segments) {
            var segment = this.segments[i];
            var previous = this.segmentToStation(segment.stationA);
            segment.draw(previous, drawSettings);
        }
        for (var i in this.stationsMinor) {
            var stationMinor = this.stationsMinor[i];
            var segment = this.findSegmentForStationMinor(stationMinor);
            this.stationsMinor[i].draw(segment);
        }
        for (var i in this.stationsMajor) {
            this.stationsMajor[i].draw();
        }
        // this.notifyAllObservers(this);
    },
    createText: function(station, positionRelative) {
        var text = new PointText(station.position + positionRelative);
        text.justification = 'left';
        text.fillColor = 'black';
        text.content = station.name;
        return text;
    },
    preventIntersectionSegments: function(text, station, paths, positions) {
        if (!paths) {
            return positions[0];
        }
        var positionsTried = 0;
        var intersects = true;
        while (intersects && positionsTried < positions.length) {
            intersects = false;
            for (var j in paths) {
                if (positionsTried >= positions.length-1) {
                    break;
                }
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
        return positions[positionsTried];
    },
    drawStationNames: function(paths, drawSettings) {
        var fontSize = 14;
        this.drawMajorStationNames(paths, fontSize, drawSettings.calcTextPositions);
        fontSize = 10;
        if (drawSettings.minorStationText) {
            this.drawMinorStationNames(fontSize);
        }
    },
    drawMajorStationNames: function(paths, fontSize, calcTextPositions) {
        for (var i in this.stationsMajor) {
            var station = this.stationsMajor[i];
            if (!calcTextPositions && station.textPositionRel) {
                text = this.createText(station, station.textPositionRel);
                text.fontSize = fontSize;
                continue;
            }
            var stationRadius = station.style.stationRadius + station.style.strokeWidth;
            var defaultPosition = new Point(stationRadius, fontSize / 4.0)
            var text = this.createText(station, defaultPosition);
            text.fontSize = fontSize;
            if (!calcTextPositions) {
                continue;
            } else {
                console.log('recalc best text position');
                var positions = [];
                positions.push(defaultPosition);
                positions.push(new Point(-stationRadius - text.bounds.width, fontSize / 4.0));
                positions.push(new Point(0, -stationRadius * 1.2));
                positions.push(new Point(stationRadius, -stationRadius * 0.8));
                positions.push(new Point(-text.bounds.width, -stationRadius * 1.2));
                positions.push(new Point(-text.bounds.width-stationRadius, -stationRadius * 0.8));
                positions.push(new Point(0, stationRadius * 2.2));
                positions.push(new Point(stationRadius, stationRadius * 1.4));
                positions.push(new Point(-text.bounds.width, stationRadius * 2.2));
                positions.push(new Point(-text.bounds.width-stationRadius, stationRadius * 1.2));
                var pathsToUse = paths;
                if (paths.length === 0) {
                    pathsToUse = this.stationSegmentPaths(station);
                }
                station.textPositionRel = this.preventIntersectionSegments(text, station, pathsToUse, positions);
            }
        }
    },
    stationSegmentPaths: function(station) {
        var segmentTo = this.segmentToStation(station);
        var segmentFrom = this.segmentFromStation(station);
        var segments = [];
        if (segmentTo) {
            segments.push(segmentTo);
        }
        if (segmentFrom) {
            segments.push(segmentFrom);
        }
        var pathsLocal = [];
        for (var i in segments) {
            for (var j in segments[i].paths) {
                pathsLocal.push(segments[i].paths[j]);
            }
        }
        return pathsLocal;
    },
    drawMinorStationNames: function(fontSize) {
        for (var i in this.stationsMinor) {
            var station = this.stationsMinor[i];
            var stationLineDirection = station.direction();
            var xOffset = 0;
            var position = station.direction()*station.style.minorStationSize*1.2;
            var text = this.createText(station, position);
            text.fontSize = fontSize;
            if (stationLineDirection.x < 0) {
                xOffset = -text.bounds.width;
                text.position += new Point(xOffset, 0);
            }
            if (stationLineDirection.y > 0.01) {
                yOffset = text.bounds.height/1.5;
                text.position += new Point(0, yOffset);
            }
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
        console.log('track.removeStation() on track:', this.id);
        function removeFromTrackState(track, id) {
            var station = track.findStation(id);
            if (station) {
                console.log('track.removeStation()', station);
                var pos = track.stations.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stations.splice(pos, 1);
                }
                pos = track.stationsMajor.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stationsMajor.splice(pos, 1);
                }
                pos = track.stationsMinor.indexOf(station);
                if (pos > -1) {
                    station.notifyBeforeRemove();
                    track.stationsMinor.splice(pos, 1);
                }
            }
        }
        removeFromTrackState(this, id);
        for (var i = this.segments.length - 1; i >= 0; i--) {  // loop backwards because we splice the array
            var segment = this.segments[i];
            if (segment.stationA.id === id || segment.stationB.id === id) {
                var pos = this.segments.indexOf(segment);
                if (pos > -1) {
                    var stationsRemoved = segment.removeAllOnSegmentStations();
                    for (var j in stationsRemoved) {
                        removeFromTrackState(this, stationsRemoved[j].id);
                    }
                    this.segments.splice(pos, 1);
                }
            } else {
                segment.removeStation(id);
            }
        }
        return ;
    },
    findSegmentByPathId: function(id) {
        for (var i in this.segments) {
            if (this.segments[i].path.id === id) {
                return this.segments[i];
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
    findSegmentBetweenStations: function(stationA, stationB) {
        for (var i in this.segments) {
            if (stationA.id === this.segments[i].stationA.id
                && stationB.id === this.segments[i].stationB.id) {
                return this.segments[i];
            }
        }
        return null;
    },
    findSegmentForStationMinor: function(stationMinor) {
        return this.findSegmentBetweenStations(stationMinor.stationA, stationMinor.stationB);
    },
    findSegmentsForStation: function(station) {
        var segments = [];
        for (var i in this.segments) {
            var index = this.segments[i].stations.indexOf(station);
            if (index != -1) {
                segments.push(this.segments[i]);
            }
        }
        return segments;
    }
};


function createTrack() {
    var observable = Object.create(util.Observable).Observable();
    var track = Object.assign(observable, Track);
    track = track.Track();
    return track;
}


module.exports = {
    createTrack: createTrack,
};