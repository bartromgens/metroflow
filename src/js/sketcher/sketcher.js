require("paper");
var core = require("../core.js");
var metromap = require("../map.js");
var snap = require("../snap.js");
var revision = require("../revision.js");
var interaction = require("../interaction.js");
var serialize = require("../serialize.js");
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
    drawSettings = metromap.createDrawSettings();
    drawSettings.minorStationText = true;
    drawSettingsDrag = metromap.createDrawSettings();
    drawSettingsDrag.text = false;
    drawSettingsDrag.fast = true;
    drawSettingsFull = metromap.createDrawSettings();
    drawSettingsFull.text = true;
    drawSettingsFull.fast = false;
    drawSettingsFull.calcTextPositions = true;
    drawSettingsFull.minorStationText = true;
    initialiseToolbarActions();
    var newMap = metromap.createMap();
    setNewMap(newMap);
    setCurrentTrack(createTrack());
}


function setNewMap(newMap) {
    map = newMap;
    interaction.setCurrentMap(newMap);
}


function onRemoveStation(stationId) {
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
        interaction.showStationContextMenu(stationClicked.id);
        // interaction.hideStationInfoAll();
        // interaction.showStationInfo(stationClicked);
        return;
    }
    var segmentClicked = getSegmentClicked(hitResult);
    if (segmentClicked) {  // right mouse
        interaction.showSegmentContextMenu(segmentClicked.id);
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
            revision.createRevision(map);
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
            var offsetFactor = segmentClicked.getOffsetOf(event.point) / segmentClicked.length();
            var stationNew = currentTrack.createStationOnSegment(segmentClicked, offsetFactor);
            map.draw(drawSettings);
            revision.createRevision(map);
            // TODO: create elements based on track/map observer in interaction
            var stationElement = interaction.createStationElement(stationNew, currentTrack, onRemoveStation);
            contextmenu.createStationContextMenu(stationElement.id, onRemoveStation);
            return;
        }
    } else {
        if (!selectedStation) {
            selectedStation = currentTrack.lastAddedStation();
        }
        var stationNew = currentTrack.createStationFree(event.point, selectedStation);
        if (doSnap) {
            var position = snap.snapPosition(currentTrack, stationNew, event.point);
            stationNew.setPosition(position);
        }
        selectStation(stationNew);
        // TODO: create elements based on track/map observer in interaction
        var stationElement = interaction.createStationElement(stationNew, currentTrack, onRemoveStation);
        contextmenu.createStationContextMenu(stationElement.id, onRemoveStation);
        var segmentElements = interaction.createSegmentElements(currentTrack);
        for (var i in segmentElements) {
            var element = segmentElements[i];
            contextmenu.createSegmentContextMenu(element.id, currentTrack);
        }
        revision.createRevision(map);
        return;
    }
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
                currentTrack.createStationMinorOnSegmentId(event.point, segmentClicked.id);
                map.draw(drawSettings);
                revision.createRevision(map);
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
        revision.createRevision(map);
        connectionStationA = null;
        connectionStationB = null;
    }
}


function onMouseDown(event) {
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
        revision.createRevision(map);
        dragging = false;
    }
}


function onMouseDrag(event) {
    dragging = true;
	if (selectedStation) {
        var position = event.point;
	    if (doSnap && selectedStation.doSnap) {
	        position = snap.snapPosition(currentTrack, selectedStation, event.point);
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
        revision.createRevision(map);
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
        core.DisplaySettings.isDebug = event.target.checked;
        map.draw(drawSettings);
        if (core.DisplaySettings.isDebug) {
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
        var mapJSONString = serialize.saveMap(map);
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
        revision.createRevision(map);
        project.clear();
        resetState();
    }

    function finishLoadMap(newMap) {
        newMap.draw(drawSettingsFull);
        revision.createRevision(newMap);
        var mapElements = interaction.createMapElements(newMap, onRemoveStation);
        createContextMenusMapElements(mapElements);
    }

    function createContextMenusMapElements(mapElements) {
        for (var i in mapElements) {
            var track = mapElements[i].track;
            var stationElements = mapElements[i].stationElements;
            var segmentElements = mapElements[i].segmentElements;
            for (var j in segmentElements) {
                contextmenu.createSegmentContextMenu(segmentElements[j].id, track);
            }
            for (var j in stationElements) {
                contextmenu.createStationContextMenu(stationElements[j].id, onRemoveStation);
            }
        }
    }

    function loadMapJson(json) {
        var newMap = serialize.loadMap(json);
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
        interaction.createMapElements(map, onRemoveStation);
        for (var i in map.tracks) {
            sidebar.notifyTrackChanged(map.tracks[i]);
        }
    }

    function onUndoButtonClicked() {
        if (!revision.hasUndo()) {
            console.log('NO UNDO AVAILABLE');
            return;
        }
        var currentTrackId = prepareUndoRedo();
        setNewMap(revision.undo(map));
        finaliseUndoRedo(currentTrackId);
    }


    function onRedoButtonClicked() {
        if (!revision.hasRedo()) {
            console.log('NO REDO AVAILABLE');
            return;
        }
        var currentTrackId = prepareUndoRedo();
        setNewMap(revision.redo(map));
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

// TODO: update html elements on zoom
$("canvas").bind("wheel", function(event) {
    var point = new Point(event.clientX, event.clientY);
    zoom(-event.originalEvent.deltaY, point);

    function allowedZoom(zoom) {
        console.log(zoom);
        if (zoom !== paper.view.zoom)
        {
            paper.view.zoom = zoom;
            return zoom;
        }
        return null;
    }

    function zoom(delta, point) {
        if (!delta) return;

        var oldZoom = paper.view.zoom;
        var oldCenter = paper.view.center;
        var viewPos = paper.view.viewToProject(point);
        var newZoom = delta > 0 ? oldZoom * 1.05 : oldZoom / 1.05;

        if (!allowedZoom(newZoom)) {
            return;
        }

        var zoomScale = oldZoom / newZoom;
        var centerAdjust = viewPos.subtract(oldCenter);
        var offset = viewPos.subtract(centerAdjust.multiply(zoomScale)).subtract(oldCenter);

        paper.view.center = view.center.add(offset);

        var stations = map.stations();
        for (var i in stations) {
            stations[i].notifyAllObservers();
        }
        var segments = map.segments();
        for (var i in segments) {
            segments[i].notifyAllObservers();
        }
    }
});


tool.onMouseDown = onMouseDown;
tool.onMouseUp = onMouseUp;
tool.onMouseDrag = onMouseDrag;
tool.onKeyDown = onKeyDown;
