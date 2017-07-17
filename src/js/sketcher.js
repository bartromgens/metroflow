require("paper");
var core = require("./core.js");
var metromap = require("./map.js");
var snap = require("./snap.js");
var interaction = require("./interaction.js");
var sidebar = require("./ui/sidebar.js");
var toolbar = require("./ui/toolbar.js");
var serialize = require("./serialize.js");

$(initialise);

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


function initialise() {
    drawSettings = metromap.createDrawSettings();
    drawSettingsDrag = metromap.createDrawSettings();
    drawSettingsDrag.text = false;
    drawSettingsDrag.fast = true;
    drawSettingsFull = metromap.createDrawSettings();
    drawSettingsFull.text = true;
    drawSettingsFull.fast = false;
    drawSettingsFull.calcTextPositions = true;
    initialiseToolbarActions();
    map = metromap.createMap();
    setCurrentTrack(map.createTrack());
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


function setCurrentTrack(track) {
    if (!track) {
        return;
    }
    currentTrack = track;
    selectedStation = null;
    sidebar.setCurrentTrack(track);
}


function getStationClicked(hitResult) {
    var path = hitResult.item;
    var result = map.findStationByPathId(path.id);
    var stationClicked = result.station;
    setCurrentTrack(result.track);
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
        return;
    }
    var segmentClicked = getSegmentClicked(hitResult);
    if (segmentClicked) {  // right mouse
        interaction.showSegmentContextMenu(segmentClicked.id);
        return;
    }
}


function onClickMajorStationMode(event) {
    console.log('onClickMajorStation');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            console.log('station clicked');
            stationClicked.select();
            selectedStation = stationClicked;
        }
    } else {
        if (!selectedStation) {
            selectedStation = currentTrack.lastAddedStation();
        }
        var stationNew = currentTrack.createStation(event.point, selectedStation);
        if (doSnap) {
            var position = snap.snapPosition(currentTrack, stationNew, event.point);
            stationNew.setPosition(position);
        }
        selectedStation = stationNew;
        sidebar.notifyNewStation(stationNew, currentTrack);
        interaction.createStationElement(stationNew, currentTrack);
        interaction.createSegmentElements(currentTrack);
        map.draw(drawSettings);
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
            } else {
                console.log('warning: no segment clicked');
            }
        }
    }
}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            stationClicked.toggleSelect();
            selectedStation = stationClicked;
            map.draw(drawSettings);
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
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
    var stationClicked = getStationClicked(hitResult);
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
        connectionStationA.unselect();
        map.draw(drawSettings);
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
        dragging = false;
    }
}


function onMouseDrag(event) {
    dragging = true;
	if (selectedStation) {
        var position = event.point;
	    if (doSnap) {
	        position = snap.snapPosition(currentTrack, selectedStation, event.point);
        }
        selectedStation.setPosition(position);
	    map.draw(drawSettingsDrag);
	}
}


function onKeyDown(event) {
    if (event.key === 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
        map.draw(drawSettings);
        if (core.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
            $(".segment").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
            $(".segment").css('border-width', '0px');
        }
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
    toolbar.setSaveMapAction(saveMapClicked);
    toolbar.setLoadMapAction(loadMapClicked);

    sidebar.setExampleMapAction(loadExampleMapClicked);
    sidebar.setTrackColorChangeAction(onTrackColorChanged);
    sidebar.setTrackWidthSliderChangeAction(onTrackWidthChanged);
    sidebar.setStationRadiusSliderChangeAction(onStationRadiusChanged);
    sidebar.setStationStrokeWidthSliderChangeAction(onStationStrokeWidthChanged);
    sidebar.setStationStrokeColorChangeAction(onStationStrokeColorChanged);

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
        var newTrack = map.createTrack();
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
        project.clear();
        resetState();
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

    function loadMapJson(json) {
        map = serialize.loadMap(json);
        if (map.tracks.length > 0) {
            setCurrentTrack(map.tracks[0]);
        }
        map.draw(drawSettingsFull);
    }

    function loadMapFile(filepath) {
        project.clear();
        $.getJSON(filepath, function(json) {
            loadMapJson(json);
        });
    }

    function loadExampleMapClicked() {
        loadMapFile("src/maps/test1.json");
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




