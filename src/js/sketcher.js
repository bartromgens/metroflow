require("paper");
var core = require("./core.js");
var interaction = require("./interaction.js");
var sidebar = require("./sidebar.js");

var track = core.createTrack();
var snapDistance = 60;

var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

var stationClicked = null;

function onMouseDown(event) {
    console.log('key', event.event.which);

	var hitResult = project.hitTest(event.point, hitOptions);
	if (hitResult) {
		var path = hitResult.item;
        stationClicked = track.findStationByPathId(path.id);
        if (stationClicked) {
            if (event.event.which == 3) {  // right mouse
                interaction.showStationContextMenu(stationClicked.id);
                return;
            }
            stationClicked.toggleSelect();
        }
		if (hitResult.type == 'segment') {
			segment = hitResult.segment;
        }
		return;
	}

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

    var stationNew = track.createStation(position);
    registerForSidebar(stationNew);
	interaction.createStationElement(stationNew, track);
	sidebar.showStations(track);
}

function onMouseDrag(event) {
    console.log('mouseDrag');
	if (stationClicked) {
	    stationClicked.setPosition(stationClicked.position + event.delta);
	    track.draw();
	}
}

tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;


tool.onKeyDown = function(event) {
    if (event.key == 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
        track.draw();
        if (core.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
        }
    }
}

function registerForSidebar(station) {
    var stationObserver = new core.StationObserver(
        function(station) {
            sidebar.showStations(track);
        },
        function(station) {
            sidebar.showStations(track);
        }
    );
    station.registerObserver(stationObserver);
}
