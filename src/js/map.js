core = require("./core.js");
metrotrack = require("./track.js");


var Map = {
    Map: function() {
        this.tracks = [];
        return this;
    },
    createTrack: function() {
        var newTrack = metrotrack.createTrack();
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
            var station = metrotrack.findStationByPathId(id);
            if (station) {
                return {station: station, track: track};
            }
        }
        return {station: null, track: null};
    },
    findSegmentByPathId: function(id) {
        for (var i in this.tracks) {
            var track = this.tracks[i];
            var segment = metrotrack.findSegmentByPathId(id);
            if (segment) {
                return {segment: segment, track: track};
            }
        }
        return {segment: null, track: null};
    }
};


function createMap() {
    var observable = Object.create(core.Observable).Observable();
    var map = Object.assign(observable, Map);
    map = map.Map();
    return map;
}


module.exports = {
    createMap: createMap,
};