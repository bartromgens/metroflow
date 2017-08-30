util = require("./util.js");
metrotrack = require("./track.js");
metroconnection = require("./connection.js");


var DrawSettings = {
    text: true,
    fast: false,
    calcTextPositions: false,
    minorStationText: false,
};


function createDrawSettings() {
    var drawSettings = {};
    Object.keys(DrawSettings).forEach(function(key) {
        drawSettings[key] = DrawSettings[key];
    });
    return drawSettings;
}


var Map = {
    Map: function() {
        this.tracks = [];
        this.connections = [];
        return this;
    },
    createTrack: function() {
        console.log('map.createTrack()');
        var newTrack = metrotrack.createTrack();
        this.tracks.push(newTrack);
        return newTrack;
    },
    createConnection: function(stationA, stationB) {
        console.log('map.createConnection()');
        if (stationA.id === stationB.id) {
            return null
        }
        var newConnection = metroconnection.createConnection(stationA, stationB);
        this.connections.push(newConnection);
        return newConnection;
    },
    removeStation: function(id) {
        for (var i in this.tracks) {
            this.tracks[i].removeStation(id);
        }
        for (var i = this.connections.length - 1; i >= 0; i--) {
            if (this.connections[i].stationA.id === id || this.connections[i].stationB.id === id) {
                this.connections.splice(i, 1);
            }
        }
    },
    stations: function() {
        var stations = [];
        for (var i in this.tracks) {
            stations = stations.concat(this.tracks[i].stations);
        }
        return stations;
    },
    segments: function() {
        var segments = [];
        for (var i in this.tracks) {
            segments = segments.concat(this.tracks[i].segments);
        }
        return segments;
    },
    draw: function(drawSettings) {
        console.time("map.draw");
        project.clear();
        for (var i in this.tracks) {
            this.tracks[i].draw(drawSettings);
        }
        for (var i in this.connections) {
            this.connections[i].draw();
        }
        if (drawSettings.text) {
            var paths = [];
            if (!drawSettings.fast) {
                paths = this.allPaths();
                console.log("map.draw() paths.length", paths.length);
            }
            this.drawStationNames(paths, drawSettings);
        }
        console.timeEnd("map.draw");
    },
    clear: function() {
        this.tracks = [];
    },
    drawStationNames: function(paths, drawSettings) {
        for (var i in this.tracks) {
            this.tracks[i].drawStationNames(paths, drawSettings);
        }
    },
    allPaths: function() {
        var paths = [];
        for (var i in this.tracks) {
            paths = paths.concat(this.tracks[i].allPaths());
        }
        for (var i in this.connections) {
            paths = paths.concat(this.connections[i].allPaths());
        }
        return paths;
    },
    findStation: function(id) {
        for (var i in this.tracks) {
            var station = this.tracks[i].findStation(id);
            if (station) {
                return station;
            }
        }
        return null;
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
    findSegment: function(id) {
        for (var i in this.tracks) {
            var track = this.tracks[i];
            var segment = track.findSegment(id);
            if (segment) {
                return {segment: segment, track: track};
            }
        }
        return {segment: null, track: null};
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
    },
    findTrack: function(id) {
        for (var i in this.tracks) {
            if (this.tracks[i].id === id) {
                return this.tracks[i];
            }
        }
        return null;
    },
    notifyAllStationsAndSegments: function () {
        var stations = this.stations();
        for (var i in stations) {
            stations[i].notifyAllObservers();
        }
        var segments = this.segments();
        for (var i in segments) {
            segments[i].notifyAllObservers();
        }
    }
};


function createMap() {
    var observable = Object.create(util.Observable).Observable();
    var map = Object.assign(observable, Map);
    map = map.Map();
    return map;
}


module.exports = {
    createMap: createMap,
    createDrawSettings: createDrawSettings,
};