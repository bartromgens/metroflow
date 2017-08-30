var MetroFlow = require("../../dist/metroflow.js");

var map = null;
var drawSettingsFull = null;


$(initialise);


function initialise() {
    drawSettingsFull = MetroFlow.map.createDrawSettings();
    drawSettingsFull.calcTextPositions = true;
    var newMap = createBasicMap();
    MetroFlow.zoom.enableZoomOnCanvas(newMap);
    setNewMap(newMap);
    newMap.draw(drawSettingsFull);
}


function createBasicMap() {
    var newMap = MetroFlow.map.createMap();

    var track = newMap.createTrack();
    var station1 = track.createStationFree(new Point(100, 100), null);
    station1.name = "Andromeda";
    var station2 = track.createStationFree(new Point(100, 200), station1);
    var station3 = track.createStationFree(new Point(100, 350), station2);
    var station4 = track.createStationFree(new Point(300, 600), station3);
    var segment = track.findSegmentBetweenStations(station3, station4)
    track.createStationMinor(new Point(200, 500), segment);
    var station5 = track.createStationFree(new Point(500, 500), station4);
    var station6 = track.createStationFree(new Point(300, 200), station5);
    var station7 = track.createStationFree(new Point(500, 200), station6);
    var station8 = track.createStationFree(new Point(250, 100), station6);

    return newMap;
}


function setNewMap(newMap) {
    map = newMap;
    MetroFlow.zoom.setNewMap(newMap);
    MetroFlow.interaction.setCurrentMap(newMap);
}


var startPosition = null;

function onMouseDown(event) {
    startPosition = event.point;
}

function onMouseUp(event) {
    map.notifyAllStationsAndSegments();
    startPosition = null;
}

function onMouseDrag(event) {
    var offset = startPosition - event.point;
    paper.view.center = view.center.add(offset);
    return;
}

tool.onMouseDown = onMouseDown;
tool.onMouseUp = onMouseUp;
tool.onMouseDrag = onMouseDrag;