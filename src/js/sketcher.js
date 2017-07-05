require("paper");
var core = require("./core.js");
var interaction = require("./interaction.js");
var sidebar = require("./sidebar.js");
var toolbar = require("./toolbar.js");


var track = core.createTrack();
var snapDistance = 60;
var selectedStation = null;

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


var stationClicked = null;
var segmentClicked = null;


function onClickMajorStationMode(event) {
    console.log('onClickMajorStation');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        stationClicked = track.findStationByPathId(path.id);
        if (stationClicked) {
            if (event.event.which === 3) {  // right mouse
                interaction.showStationContextMenu(stationClicked.id);
                return;
            }
            stationClicked.toggleSelect();
            selectedStation = stationClicked;
        }
    } else {
        var position = new Point(event.point.x, event.point.y);
        if (track.stations.length > 0) {
            var previousStation = track.stations[track.stations.length-1];
            if (Math.abs(previousStation.position.x - position.x) < snapDistance) {
                position.x = previousStation.position.x;
            }
            if (Math.abs(previousStation.position.y - position.y) < snapDistance) {
                position.y = previousStation.position.y;
            }
        }

        var stationNew = track.createStation(position, selectedStation);
        sidebar.notifyNewStation(stationNew, track);
        interaction.createStationElement(stationNew, track);
        interaction.createSegmentElements(track);
    }
}


function onClickMinorStationMode(event) {

}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        console.log('hitresult type', hitResult.type);
        console.log('hitResult.item;', hitResult.item);
        stationClicked = track.findStationByPathId(path.id);
        if (hitResult.type === "stroke") {
            var segments = hitResult.item.segments;
            segmentClicked = track.findSegmentByPathId(segments[0].path.id);
            console.log('segmentClicked', segmentClicked);
        }
        if (stationClicked) {
            if (event.event.which === 3) {  // right mouse
                interaction.showStationContextMenu(stationClicked.id);
                return;
            }
            stationClicked.toggleSelect();
        } else if (segmentClicked) {
            console.log('segment clicked');
            if (event.event.which === 3) {  // right mouse
                interaction.showSegmentContextMenu(segmentClicked.id, event.point);
                return;
            }
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

    if (mode === modes.majorstation) {
        onClickMajorStationMode(event);
    } else if (mode === modes.minorstation) {
        onClickMinorStationMode(event);
    } else if (mode === modes.select) {
        onClickSelectMode(event);
    }
}


function onMouseDrag(event) {
    console.log('onMouseDrag');
	if (stationClicked) {
	    stationClicked.setPosition(stationClicked.position + event.delta);
	    track.draw();
	}
}


function onKeyDown(event) {
    if (event.key === 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
//        track.draw();
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




