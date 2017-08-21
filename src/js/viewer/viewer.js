require("paper");
var MetroFlow = require("../metroflow.js");

var isDebug = false;

var map = null;
var currentTrack = null;
var segmentClicked = null;
var selectedStation = null;
var drawSettingsFull = null;

$(initialise);


function initialise() {
    MetroFlow.util.DisplaySettings.isDebug = isDebug;

    drawSettingsFull = MetroFlow.map.createDrawSettings();
    drawSettingsFull.text = true;
    drawSettingsFull.fast = false;
    drawSettingsFull.calcTextPositions = true;
    drawSettingsFull.minorStationText = true;

    setLoadMapAction(loadMapClicked);
    var newMap = MetroFlow.map.createMap();
    setNewMap(newMap);
    MetroFlow.zoom.enableZoomOnCanvas(newMap);
}


function resetState() {
    map = null;
    currentTrack = null;
    segmentClicked = null;
    selectedStation = null;
}


function setNewMap(newMap) {
    map = newMap;
    MetroFlow.zoom.setNewMap(newMap);
    MetroFlow.interaction.setCurrentMap(newMap);
}


function setLoadMapAction(callback) {
    document.getElementById('file-input').addEventListener('change', callback, false);
}


function loadMapClicked(event) {
    console.log('load map button clicked');
    prepareLoadMap();

    readSingleFile(event);

    function readSingleFile(event) {
        var file = event.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            displayContents(contents);
        };
        reader.readAsText(file);
    }

    function displayContents(contents) {
        loadMapJson(JSON.parse(contents));
    }
}


function prepareLoadMap() {
    project.clear();
    resetState();
}


function finishLoadMap(newMap) {
    newMap.draw(drawSettingsFull);
    var onRemoveStation = null;
    MetroFlow.interaction.createMapElements(newMap, onRemoveStation);
}


function loadMapJson(json) {
    var newMap = MetroFlow.serialize.loadMap(json);
    setNewMap(newMap);
    finishLoadMap(newMap);
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
    console.log('panning', event.delta);
    var offset = startPosition - event.point;
    paper.view.center = view.center.add(offset);
    return;
}


tool.onMouseDown = onMouseDown;
tool.onMouseUp = onMouseUp;
tool.onMouseDrag = onMouseDrag;