var core = require("./core.js");
var metromap = require("./map.js");
var metrotrack = require("./track.js");
var metrosegment = require("./segment.js");
var metrostation = require("./station.js");


function saveMap(map) {
    var mapData = {};
    mapData.tracks = [];
    for (var i in map.tracks) {
        var trackData = createTrackData(map.tracks[i]);
        mapData.tracks.push(trackData);
    }
    console.log(mapData);
    mapJSON = JSON.stringify(mapData);
    console.log(mapJSON);
    loadMap(mapJSON);
}


function createTrackData(track) {
    var trackData = {};
    trackData.id = track.id;
    trackData.stations = [];
    trackData.stationsMinor = [];
    for (var j in track.stations) {
        var stationData = createStationData(track.stations[j]);
        trackData.stations.push(stationData)
    }
    for (var j in track.stationsMinor) {
        var stationData = createStationMinorData(track.stationsMinor[j]);
        trackData.stationsMinor.push(stationData)
    }
    return trackData;
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

function loadMap(mapJSON) {
    console.log('loadMap');
    if (!mapJSON) {
        mapJSON = '{"tracks":[{"id":"15479b48-a900-438b-a0fa-2da8c77729af","stations":[{"position":{"x":200,"y":165},"id":"b4212813","name":"station"},{"position":{"x":535,"y":424},"id":"adc99f13","name":"station"},{"position":{"x":806,"y":119},"id":"ebad26f4","name":"station"}],"stationsMinor":[{"position":{"x":274.22056274847716,"y":269.22056274847716},"id":"712c3721","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":341.3700576850888,"y":336.3700576850888},"id":"fb50a4e2","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":408.5195526217004,"y":403.5195526217004},"id":"6c52a2bb","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":634.7959415460184,"y":354.2040584539816},"id":"2f8dadac","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":697.5208152801713,"y":291.4791847198287},"id":"f99d3a55","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":760.2456890143242,"y":228.7543109856758},"id":"61b3fb5a","name":"station","stationA":"adc99f13","stationB":"ebad26f4"}]},{"id":"e93fb48a-518f-4f29-aa6f-1e395233cc09","stations":[{"position":{"x":209,"y":104},"id":"ce3ea5bf","name":"station"},{"position":{"x":400,"y":104},"id":"2ce21052","name":"station"},{"position":{"x":928,"y":354},"id":"292957b8","name":"station"}],"stationsMinor":[{"position":{"x":272.6666666666667,"y":104},"id":"6fee351c","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":336.3333333333333,"y":104},"id":"325fe14a","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":542.2817459305202,"y":104},"id":"074eef3a","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":684.5634918610405,"y":104},"id":"1fba151c","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":820.3205448016022,"y":216.3205448016022},"id":"5a39e0ba","name":"station","stationA":"2ce21052","stationB":"292957b8"}]}]}'
    }
    var mapData = JSON.parse(mapJSON);
    var map = metromap.createMap();
    for (var i in mapData.tracks) {
        var track = loadTrack(map, mapData.tracks[i]);
    }
    return map;
}


function loadTrack(map, trackData) {
    var track = map.createTrack();
    track.id = trackData.id;
    var previousStation = null;
    for (var j in trackData.stations) {
        var stationData = trackData.stations[j];
        var station = track.createStation(new Point(stationData.position.x, stationData.position.y), previousStation);
        station.id = stationData.id;
        previousStation = station;
    }
    for (var j in trackData.stationsMinor) {
        var stationData = trackData.stationsMinor[j];
        var stationA = track.findStation(stationData.stationA);
        var stationB = track.findStation(stationData.stationB);
        var station = track.createStationMinorBetweenStations(stationA, stationB);
        station.id = stationData.id;
    }
    return track;
}


module.exports = {
    saveMap: saveMap,
    loadMap: loadMap,
};