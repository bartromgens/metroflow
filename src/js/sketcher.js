require("paper");
var core = require("./core.js");
var interaction = require("./interaction.js");
var sidebar = require("./sidebar.js");
var toolbar = require("./toolbar.js");


var track = core.createTrack();
var snapDistance = 60;

var modes = {
    majorstation: "majorstation",
    minorstation: "minorstation",
    select: "select"
};

var mode = modes.majorstation;


var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 3
};


var segmentClicked = null;
var selectedStation = null;


function getStationClicked(hitResult) {
    var path = hitResult.item;
    var stationClicked = track.findStationByPathId(path.id);
    return stationClicked;
}

function getSegmentClicked(hitResult) {
    var path = hitResult.item;
    var segments = hitResult.item.segments;
    var segmentClicked = track.findSegmentByPathId(segments[0].path.id);
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
        var position = new Point(event.point.x, event.point.y);
        var stationNew = track.createStation(position, selectedStation);
        selectedStation = stationNew;
        sidebar.notifyNewStation(stationNew, track);
        interaction.createStationElement(stationNew, track);
        interaction.createSegmentElements(track);
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
                track.createStationMinor(event.point, segmentClicked.id);
            } else {
                console.log('warning: no segment clicked');
            }
        }
    }
}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        console.log('hitresult type', hitResult.type);
        console.log('hitResult.item;', hitResult.item);
        var stationClicked = track.findStationByPathId(path.id);
        if (hitResult.type === "stroke") {
            var segments = hitResult.item.segments;
            segmentClicked = track.findSegmentByPathId(segments[0].path.id);
            console.log('segmentClicked', segmentClicked);
        }
        if (stationClicked) {
            stationClicked.toggleSelect();
            selectedStation = stationClicked;
        } else if (segmentClicked) {
            segmentClicked.toggleSelect();
        }
        if (hitResult.type === 'segment') {
            console.log('segment found');
            segment = hitResult.segment;
        }
    }
}


function onMouseDown(event) {
    console.log('key', event.event.which);
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
    }
}


function onMouseDrag(event) {
	if (selectedStation) {
	    var position = core.snapPosition(track, selectedStation, event.point);
        selectedStation.setPosition(position);
	    track.draw();
	}
}


function onKeyDown(event) {
    if (event.key === 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
        track.draw();
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

    toolbar.setMajorStationButtonAction(majorStationButtonClicked);
    toolbar.setMinorStationButtonAction(minorStationButtonClicked);
    toolbar.setSelectButtonAction(selectButtonClicked);
}


$(initialiseToolbarActions);


tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;
tool.onKeyDown = onKeyDown;




