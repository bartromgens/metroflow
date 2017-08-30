require("paper");

var MetroFlow = require("../metroflow.js");

var sidebar = require("./sidebar.js");
var toolbar = require("./toolbar.js");
var contextmenu = require("./contextmenu.js");


$(initialise);

// disable browser context menu
$('body').on('contextmenu', '#paperCanvas', function(e){ return false; });

var map = null;
var currentTrack = null;
var segmentClicked = null;
var selectedStation = null;
var connectionStationA = null;
var connectionStationB = null;
var drawSettings = null;
var drawSettingsDrag = null;
var drawSettingsFull = null;
var dragging = false;
var doSnap = true;


function resetState() {
    map = null;
    currentTrack = null;
    segmentClicked = null;
    selectedStation = null;
    connectionStationA = null;
    connectionStationB = null;
    dragging = false;
}


var modes = {
    majorstation: "majorstation",
    minorstation: "minorstation",
    select: "select",
    createConnection: "createConnection"
};


var mode = modes.majorstation;


var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 3
};

function initialise() {
    drawSettings = MetroFlow.map.createDrawSettings();
    drawSettings.minorStationText = true;
    drawSettingsDrag = MetroFlow.map.createDrawSettings();
    drawSettingsDrag.text = false;
    drawSettingsDrag.fast = true;
    drawSettingsFull = MetroFlow.map.createDrawSettings();
    drawSettingsFull.text = true;
    drawSettingsFull.fast = false;
    drawSettingsFull.calcTextPositions = true;
    drawSettingsFull.minorStationText = true;
    initialiseToolbarActions();
    var newMap = MetroFlow.map.createMap();
    setNewMap(newMap);
    setCurrentTrack(createTrack());

//    MetroFlow.zoom.enableZoomOnCanvas(map);
}


function setNewMap(newMap) {
    map = newMap;
    MetroFlow.interaction.setCurrentMap(newMap);
//    MetroFlow.zoom.setNewMap(newMap);
}


function onRemoveStation(stationId) {
    selectedStation = null;
    map.removeStation(stationId);
    map.draw(drawSettings);
}


function createTrack() {
    var track = map.createTrack();
    sidebar.notifyTrackChanged(track);
    return track;
}


function setCurrentTrack(track) {
    if (!track || (currentTrack && currentTrack.id === track.id)) {
        return;
    }
    if (selectedStation) {
        selectedStation.deselect();
    }
    currentTrack = track;
    sidebar.setCurrentTrack(track);
}


function getStationClicked(hitResult, allowSwitchTrack) {
    var path = hitResult.item;
    var result = map.findStationByPathId(path.id);
    var stationClicked = result.station;
    if (allowSwitchTrack) {
        setCurrentTrack(result.track);
    }
    return stationClicked;
}


function getSegmentClicked(hitResult) {
    var path = hitResult.item;
    var segments = path.segments;
    if (!segments) {
        return null;
    }
    var result = map.findSegmentByPathId(segments[0].path.id);
    var segmentClicked = result.segment;
    setCurrentTrack(result.track);
    return segmentClicked;
}


function onRightClick(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        return;
    }

    var stationClicked = getStationClicked(hitResult);
    if (stationClicked) {  // right mouse
        MetroFlow.interaction.showStationContextMenu(stationClicked.id);
        // MetroFlow.interaction.hideStationInfoAll();
        // MetroFlow.interaction.showStationInfo(stationClicked);
        return;
    }
    var segmentClicked = getSegmentClicked(hitResult);
    if (segmentClicked) {  // right mouse
        MetroFlow.interaction.showSegmentContextMenu(segmentClicked.id);
        return;
    }
}


function selectStation(stationClicked) {
    if (selectedStation && stationClicked.id !== selectedStation.id) {
        selectedStation.deselect();
    }
    stationClicked.toggleSelect();
    selectedStation = stationClicked;
    map.draw(drawSettings);
}


function onClickMajorStationMode(event) {
    console.log('onClickMajorStation');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult, false);
        if (stationClicked && selectedStation) {
            console.log('station clicked');
            if (stationClicked.id !== selectedStation.id) {
                currentTrack.createSegment(stationClicked, selectedStation);
            }
            map.draw(drawSettings);
            MetroFlow.revision.createRevision(map);
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
            var offsetFactor = segmentClicked.getOffsetOf(event.point) / segmentClicked.length();
            var stationNew = currentTrack.createStationOnSegment(segmentClicked, offsetFactor);
            map.draw(drawSettings);
            MetroFlow.revision.createRevision(map);
            // TODO: create elements based on track/map observer in interaction
            var stationElement = MetroFlow.interaction.createStationElement(stationNew, currentTrack, onRemoveStation);
            contextmenu.createStationContextMenu(stationElement.attr('id'), onRemoveStation);
            return;
        }
    } else {
        if (!selectedStation) {
            selectedStation = currentTrack.lastAddedStation();
        }
        var stationNew = currentTrack.createStationFree(event.point, selectedStation);
        if (doSnap) {
            var position = MetroFlow.snap.snapPosition(currentTrack, stationNew, event.point);
            stationNew.setPosition(position);
        }
        selectStation(stationNew);
        // TODO: create elements based on track/map observer in interaction
        var stationElement = MetroFlow.interaction.createStationElement(stationNew, currentTrack, onRemoveStation);
        contextmenu.createStationContextMenu(stationElement.attr('id'), onRemoveStation);
        var segmentElements = MetroFlow.interaction.createSegmentElements(currentTrack);
        for (var i in segmentElements) {
            var element = segmentElements[i];
            contextmenu.createSegmentContextMenu(element.attr('id'), createStationMinorOnMap);
        }
        MetroFlow.revision.createRevision(map);
        return;
    }
}


function createStationMinorOnMap(position, segmentId) {
    var segmentInfo = map.findSegment(segmentId);
    segmentInfo.track.createStationMinorOnSegmentId(position, segmentId);
    map.draw(drawSettings);
    MetroFlow.revision.createRevision(map);
}


function onClickMinorStationMode(event) {
    console.log('onClickMinorStationMode');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        if (hitResult.type === "stroke" || path) {
            console.log('stroke hit');
            segmentClicked = getSegmentClicked(hitResult);
            if (segmentClicked) {
                createStationMinorOnMap(event.point, segmentClicked.id);
            } else {
                console.log('warning: no segment clicked');
            }
        }
    }
}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult, true);
        if (stationClicked) {
            console.log('selectedStation', selectedStation);
            selectStation(stationClicked);
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
            console.log('segment clicked');
            segmentClicked.toggleSelect();
            map.draw(drawSettings);
            return;
        }
    }
}


function onClickCreateConnectionMode(event) {
    console.log('onClickCreateConnectionMode');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        return;
    }
    var stationClicked = getStationClicked(hitResult, false);
    if (!stationClicked) {
        return
    }

    if (!connectionStationA) {
        connectionStationA = stationClicked;
        connectionStationA.select();
        map.draw(drawSettings);
    } else {
        connectionStationB = stationClicked;
        if (connectionStationA.id === connectionStationB.id) {
            connectionStationB = null;
            return;
        }
        console.log('create new connection', connectionStationA.id, connectionStationB.id);
        map.createConnection(connectionStationA, connectionStationB);
        connectionStationA.deselect();
        map.draw(drawSettings);
        MetroFlow.revision.createRevision(map);
        connectionStationA = null;
        connectionStationB = null;
    }
}

var startPosition = null;

function onMouseDown(event) {
    startPosition = event.point;
    if (event.event.which === 3) {  // right mouse
        onRightClick(event);
        return;
    }

    if (mode === modes.majorstation) {
        onClickMajorStationMode(event);
    } else if (mode === modes.minorstation) {
        selectedStation = null;
        onClickMinorStationMode(event);
    } else if (mode === modes.select) {
        onClickSelectMode(event);
    } else if (mode === modes.createConnection) {
        onClickCreateConnectionMode(event);
    }
}


function onMouseUp(event) {
    if (dragging) {
        map.draw(drawSettings);
        MetroFlow.revision.createRevision(map);
        dragging = false;
    }
}


function onMouseDrag(event) {
    dragging = true;
    console.log('onMouseDrag');
//    if (mode == modes.select) {
//        console.log('panning', event.delta);
//        var offset = startPosition - event.point;
//        paper.view.center = view.center.add(offset);
//        return;
//    }

	if (selectedStation) {
        var position = event.point;
	    if (doSnap && selectedStation.doSnap) {
	        position = MetroFlow.snap.snapPosition(currentTrack, selectedStation, event.point);
        }
        var segments = currentTrack.findSegmentsForStation(selectedStation);
	    console.assert(segments[0]);
        selectedStation.setPosition(position, segments[0]);
        selectedStation.select();
	    map.draw(drawSettingsDrag);
	}
}

function initialiseToolbarActions() {
    console.log('initialiseToolbarActions');

    toolbar.setMajorStationButtonAction(majorStationButtonClicked);
    toolbar.setMinorStationButtonAction(minorStationButtonClicked);
    toolbar.setSelectButtonAction(selectButtonClicked);
    toolbar.setNewTrackButtonAction(newTrackButtonClicked);
    toolbar.setNewConnectionAction(newConnectionButtionClicked);
    toolbar.setCalcTextPositionsAction(calcTextPositionButtonClicked);
    toolbar.setToggleSnapAction(snapCheckboxClicked);
    toolbar.setUndoAction(onUndoButtonClicked);
    toolbar.setRedoAction(onRedoButtonClicked);
    toolbar.setSaveMapAction(saveMapClicked);
    toolbar.setLoadMapAction(loadMapClicked);

    sidebar.setToggleMinorNamesAction(minorNamesCheckboxClicked);
    sidebar.setToggleDebugAction(debugCheckboxClicked);
    sidebar.setExampleMapAction(loadExampleMapClicked);
    sidebar.setTrackColorChangeAction(onTrackColorChanged);
    sidebar.setTrackWidthSliderChangeAction(onTrackWidthChanged);
    sidebar.setStationRadiusSliderChangeAction(onStationRadiusChanged);
    sidebar.setStationStrokeWidthSliderChangeAction(onStationStrokeWidthChanged);
    sidebar.setStationStrokeColorChangeAction(onStationStrokeColorChanged);
    sidebar.setTrackChangeAction(onTrackChanged);

    function onTrackChanged(track) {
        map.draw(drawSettings);
    }

    function majorStationButtonClicked() {
        console.log('major station drawing selected');
        mode = modes.majorstation;
    }

    function minorStationButtonClicked() {
        console.log('minor station drawing selected');
        mode = modes.minorstation;
    }

    function selectButtonClicked() {
        console.log('selection mode selected');
        mode = modes.select;
    }

    function newTrackButtonClicked() {
        console.log('new track button clicked');
        selectedStation = null;
        var newTrack = createTrack();
        MetroFlow.revision.createRevision(map);
        var segmentStyle = styles.createSegmentStyle();
        segmentStyle.strokeColor = styles.rgbToHex(0, 0, 255);
        newTrack.segmentStyle = segmentStyle;
        setCurrentTrack(newTrack);
    }

    function newConnectionButtionClicked() {
        console.log('new connection button clicked');
        connectionStationA = null;
        connectionStationB = null;
        mode = modes.createConnection;
    }

    function calcTextPositionButtonClicked() {
        console.log('calc text position button clicked');
        map.draw(drawSettingsFull);
    }

    function snapCheckboxClicked(event) {
        console.log('snap clicked', event.target.checked);
        doSnap = event.target.checked;
        map.draw(drawSettingsFull);
    }

    function minorNamesCheckboxClicked(event) {
        console.log('minor names clicked', event.target.checked);
        drawSettings.minorStationText = event.target.checked;
        drawSettingsFull.minorStationText = event.target.checked;
        map.draw(drawSettingsFull);
    }

    function debugCheckboxClicked(event) {
        console.log('debug clicked', event.target.checked);
        MetroFlow.util.DisplaySettings.isDebug = event.target.checked;
        map.draw(drawSettings);
        if (MetroFlow.util.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
            $(".segment").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
            $(".segment").css('border-width', '0px');
        }
        map.draw(drawSettingsFull);
    }

    function saveMapClicked() {
        console.log('save map button clicked');
        var mapJSONString = MetroFlow.serialize.saveMap(map);
        var data = "text/json;charset=utf-8," + encodeURIComponent(mapJSONString);
        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';

        // var container = document.getElementById('toolbar');
        // container.appendChild(a);
        a.click();
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
        console.log('create revision before clear');
        MetroFlow.revision.createRevision(map);
        project.clear();
        resetState();
    }

    function finishLoadMap(newMap) {
        newMap.draw(drawSettingsFull);
        MetroFlow.revision.createRevision(newMap);
        var mapElements = MetroFlow.interaction.createMapElements(newMap, onRemoveStation);
        createContextMenusMapElements(mapElements);
    }

    function createContextMenusMapElements(mapElements) {
        for (var i in mapElements) {
            var track = mapElements[i].track;
            var stationElements = mapElements[i].stationElements;
            var segmentElements = mapElements[i].segmentElements;
            for (var j in segmentElements) {
                contextmenu.createSegmentContextMenu(segmentElements[j].attr('id'), track);
            }
            for (var j in stationElements) {
                contextmenu.createStationContextMenu(stationElements[j].attr('id'), onRemoveStation);
            }
        }
    }

    function loadMapJson(json) {
        var newMap = MetroFlow.serialize.loadMap(json);
        setNewMap(newMap);
        if (newMap.tracks.length > 0) {
            setCurrentTrack(newMap.tracks[0]);
        }
        finishLoadMap(newMap);
    }

    function loadMapFile(filepath) {
        console.log('loadMapFile');
        $.getJSON(filepath, function(json) {
            loadMapJson(json);
        });
    }

    function loadExampleMapClicked(filename) {
        prepareLoadMap();
        loadMapFile("src/maps/" + filename);
    }

    function prepareUndoRedo() {
        var currentTrackId = null;
        if (currentTrack) {
            currentTrackId = currentTrack.id;
        }
        project.clear();
        resetState();
        return currentTrackId;
    }

    function finaliseUndoRedo(currentTrackId) {
        var track = null;
        if (currentTrackId) {
            track = map.findTrack(currentTrackId);
        }
        if (track && map.tracks) {
            track = map.tracks[map.tracks.length-1];
        } else {
            track = createTrack();
        }
        setCurrentTrack(track);
        map.draw(drawSettingsFull);
        MetroFlow.interaction.createMapElements(map, onRemoveStation);
        for (var i in map.tracks) {
            sidebar.notifyTrackChanged(map.tracks[i]);
        }
    }

    function onUndoButtonClicked() {
        if (!MetroFlow.revision.hasUndo()) {
            console.log('NO UNDO AVAILABLE');
            return;
        }
        var currentTrackId = prepareUndoRedo();
        setNewMap(MetroFlow.revision.undo(map));
        finaliseUndoRedo(currentTrackId);
    }


    function onRedoButtonClicked() {
        if (!MetroFlow.revision.hasRedo()) {
            console.log('NO REDO AVAILABLE');
            return;
        }
        var currentTrackId = prepareUndoRedo();
        setNewMap(MetroFlow.revision.redo(map));
        finaliseUndoRedo(currentTrackId);
    }

    function onTrackColorChanged(color) {
        console.log('onTrackColorChanged');
        var segmentStyle = currentTrack.segmentStyle;
        segmentStyle.strokeColor = color;
        currentTrack.setSegmentStyle(segmentStyle);
        map.draw(drawSettings);
    }

    function onTrackWidthChanged(value) {
        var segmentStyle = currentTrack.segmentStyle;
        segmentStyle.strokeWidth = value;
        currentTrack.setSegmentStyle(segmentStyle);
        map.draw(drawSettings);
    }

    function onStationRadiusChanged(radius) {
        console.log('onStationRadiusChanged', radius);
        currentTrack.stationStyle.stationRadius = radius;
        map.draw(drawSettings);
    }

    function onStationStrokeWidthChanged(strokeWidth) {
        currentTrack.stationStyle.strokeWidth = strokeWidth;
        map.draw(drawSettings);
    }

    function onStationStrokeColorChanged(color) {
        currentTrack.stationStyle.strokeColor = color;
        map.draw(drawSettings);
    }
}

tool.onMouseDown = onMouseDown;
tool.onMouseUp = onMouseUp;
tool.onMouseDrag = onMouseDrag;
tool.onKeyDown = onKeyDown;
