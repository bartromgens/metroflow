var metromap = require("./map.js");


function saveMap(map) {
    var mapData = {};
    mapData.tracks = [];
    mapData.connections = [];
    for (var i in map.tracks) {
        var trackData = createTrackData(map.tracks[i]);
        mapData.tracks.push(trackData);
    }
    for (var i in map.connections) {
        var connectionData = createConnectionData(map.connections[i]);
        mapData.connections.push(connectionData);
    }
    console.log(mapData);
    var mapJSONString = JSON.stringify(mapData);
    return mapJSONString;
}


function createTrackData(track) {
    var trackData = {};
    trackData.id = track.id;
    trackData.segmentStyle = track.segmentStyle;
    trackData.stationStyle = track.stationStyle;
    trackData.segments = [];
    trackData.stationsMinor = [];
    for (var j in track.segments) {
        var segmentData = createSegmentData(track.segments[j]);
        trackData.segments.push(segmentData)
    }
    return trackData;
}


function createConnectionData(connection) {
    var connectionData = {
        stationA: connection.stationA.id,
        stationB: connection.stationB.id,
        id: connection.id,
    };
    return connectionData;
}


function createSegmentData(segment) {
    var stationsUserData = [];
    for (var i in segment.stationsUser) {
        stationsUserData.push(createStationData(segment.stationsUser[i]));
    }
    var stationsAutoData = [];
    for (var i in segment.stationsAuto) {
        stationsAutoData.push(createStationData(segment.stationsAuto[i]));
    }
    var segmentData = {
        stationA: createStationData(segment.stationA),
        stationB: createStationData(segment.stationB),
        stationsUser: stationsUserData,
        stationsAuto: stationsAutoData,
        id: segment.id,
    };
    return segmentData;
}


function createStationData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
        offsetFactor: station.offsetFactor,
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
        // mapJSON = '{"tracks":[{"id":"15479b48-a900-438b-a0fa-2da8c77729af","stations":[{"position":{"x":200,"y":165},"id":"b4212813","name":"station"},{"position":{"x":535,"y":424},"id":"adc99f13","name":"station"},{"position":{"x":806,"y":119},"id":"ebad26f4","name":"station"}],"stationsMinor":[{"position":{"x":274.22056274847716,"y":269.22056274847716},"id":"712c3721","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":341.3700576850888,"y":336.3700576850888},"id":"fb50a4e2","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":408.5195526217004,"y":403.5195526217004},"id":"6c52a2bb","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":634.7959415460184,"y":354.2040584539816},"id":"2f8dadac","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":697.5208152801713,"y":291.4791847198287},"id":"f99d3a55","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":760.2456890143242,"y":228.7543109856758},"id":"61b3fb5a","name":"station","stationA":"adc99f13","stationB":"ebad26f4"}]},{"id":"e93fb48a-518f-4f29-aa6f-1e395233cc09","stations":[{"position":{"x":209,"y":104},"id":"ce3ea5bf","name":"station"},{"position":{"x":400,"y":104},"id":"2ce21052","name":"station"},{"position":{"x":928,"y":354},"id":"292957b8","name":"station"}],"stationsMinor":[{"position":{"x":272.6666666666667,"y":104},"id":"6fee351c","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":336.3333333333333,"y":104},"id":"325fe14a","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":542.2817459305202,"y":104},"id":"074eef3a","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":684.5634918610405,"y":104},"id":"1fba151c","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":820.3205448016022,"y":216.3205448016022},"id":"5a39e0ba","name":"station","stationA":"2ce21052","stationB":"292957b8"}]}]}'
        mapJSON = '{"tracks":[{"id":"3794c750-6605-49df-b810-aa5b0ebb42e8","segmentStyle":{"strokeColor":"red","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":152,"y":239},"id":"3fe7243d","name":"station"},{"position":{"x":687,"y":495},"id":"995a2376","name":"station"}],"stationsMinor":[]},{"id":"6fe22ae9-cd61-4705-aa2d-c457e11901e9","segmentStyle":{"strokeColor":"blue","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":174,"y":142},"id":"8cb86074","name":"station"},{"position":{"x":764,"y":433},"id":"882322b8","name":"station"}],"stationsMinor":[]}]}';
        mapJSON = JSON.parse(mapJSON);
    }
    var map = metromap.createMap();
    for (var i in mapJSON.tracks) {
        var track = loadTrack(map, mapJSON.tracks[i]);
    }
    for (var i in mapJSON.connections) {
        var connection = loadConnections(map, mapJSON.connections[i]);
    }
    return map;
}


function loadConnections(map, connectionData) {
    console.log('load connections');
    var stationA = map.findStation(connectionData.stationA);
    var stationB = map.findStation(connectionData.stationB);
    var connection = map.createConnection(stationA, stationB);
    if (connection) {
        connection.id = connectionData.id;
    }
    return connection;
}


function loadTrack(map, trackData) {
    console.log('load track');
    var track = map.createTrack();
    track.id = trackData.id;
    track.setSegmentStyle(trackData.segmentStyle);
    track.setStationStyle(trackData.stationStyle);
    for (var i in trackData.segments) {
        var segmentData = trackData.segments[i];
        loadSegment(map, track, segmentData);
    }
    return track;
}


function loadSegment(map, track, segmentData) {
    console.log('load segment');
    var stationAPoint = new Point(segmentData.stationA.position.x, segmentData.stationA.position.y);
    var stationBPoint = new Point(segmentData.stationB.position.x, segmentData.stationB.position.y);
    var stationA = map.findStation(segmentData.stationA.id);
    var stationB = map.findStation(segmentData.stationB.id);
    var segment = null;
    if (stationA && stationB) {
        segment = track.createSegment(stationA, stationB);
    } else if (stationA) {
        stationB = track.createStationFree(stationBPoint, stationA);
        stationB.id = segmentData.stationB.id;
        stationB.name = segmentData.stationB.name;
        segment = track.findSegmentsForStation(stationB)[0];
    } else if (stationB) {
        stationA = track.createStationFree(stationAPoint);
        stationA.id = segmentData.stationA.id;
        stationA.name = segmentData.stationA.name;
        segment = track.createSegment(stationA, stationB);
    } else {
        stationA = track.createStationFree(stationAPoint);
        stationA.id = segmentData.stationA.id;
        stationA.name = segmentData.stationA.name;
        stationB = track.createStationFree(stationBPoint);
        stationB.id = segmentData.stationB.id;
        stationB.name = segmentData.stationB.name;
        segment = track.createSegment(stationA, stationB);
    }
    console.assert(segment);

    for (var i in segmentData.stationsUser) {
        var stationData = segmentData.stationsUser[i];
        if (segment.stationA.id === stationData.id || segment.stationB.id === stationData.id) {
            continue;
        }
        var offsetFactor = segmentData.offsetFactor;
        var station = track.createStationOnSegment(segment, offsetFactor);
        station.offsetFactor = stationData.offsetFactor;
        station.id = stationData.id;
        station.name = stationData.name;
    }

    for (var i in segmentData.stationsAuto) {
        var stationData = segmentData.stationsAuto[i];
        var station = track.createStationMinor(stationData.position, segment);
        station.id = stationData.id;
        station.name = stationData.name;
    }
}


module.exports = {
    saveMap: saveMap,
    loadMap: loadMap,
};