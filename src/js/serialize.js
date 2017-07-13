var core = require("./core.js");
var metromap = require("./map.js");
var metrotrack = require("./track.js");
var metrosegment = require("./segment.js");
var metrostation = require("./station.js");


function saveMap(map) {
    var mapData = {};
    mapData.stations = [];
    mapData.stationsMinor = [];
    for (var i in map.tracks) {
        var track = map.tracks[i];
        for (var j in track.stations) {
            var station = track.stations[j];
            var stationData = createStationData(station);
            mapData.stations.push(stationData)
        }
        for (var j in track.stationsMinor) {
            var station = track.stationsMinor[j];
            var stationData = createStationMinorData(station);
            mapData.stationsMinor.push(stationData)
        }
    }
    console.log(mapData);
    mapJSON = JSON.stringify(mapData);
    console.log(mapJSON);
    loadMap(mapJSON);
}

function createStationData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
    };
    return stationData;
}

function createStationMinorData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
        stationA: station.stationA.id,
        stationB: station.stationB.id,
    };
    return stationData;
}


// function createSegment(track, segmentData) {
//     var stationA = createStation(segmentData.stationA);
//     var stationB = createStation(segmentData.stationB);
//     return segment;
// }


function createStation(stationData) {

}


function loadMap(mapJSON) {
    console.log('loadMap');
    if (!mapJSON) {
        mapJSON = '{"stations":[{"position":{"x":148,"y":94},"id":"f95d3413","name":"station"},{"position":{"x":644,"y":399},"id":"8343c5da","name":"station"}],"stationsMinor":[{"position":{"x":254.04988270759037,"y":230.04988270759037},"id":"e5dbbbdf","name":"station","stationA":"f95d3413","stationB":"8343c5da"},{"position":{"x":353.02869760331527,"y":329.02869760331527},"id":"868b8a6e","name":"station","stationA":"f95d3413","stationB":"8343c5da"},{"position":{"x":494.02281758684967,"y":399},"id":"34888905","name":"station","stationA":"f95d3413","stationB":"8343c5da"}]}'
    }
    var mapData = JSON.parse(mapJSON);
    var map = metromap.createMap();
    var track = map.createTrack();
    var previousStation = null;
    for (var i in mapData.stations) {
        var stationData = mapData.stations[i];
        var station = track.createStation(new Point(stationData.position.x, stationData.position.y), previousStation);
        station.id = stationData.id;
        previousStation = station;
    }
    for (var i in mapData.stationsMinor) {
        var stationData = mapData.stationsMinor[i];
        var stationA = track.findStation(stationData.stationA);
        var stationB = track.findStation(stationData.stationB);
        var station = track.createStationMinorBetweenStations(stationA, stationB);
        station.id = stationData.id;
    }
    return map;
}


module.exports = {
    saveMap: saveMap,
    loadMap: loadMap,
};