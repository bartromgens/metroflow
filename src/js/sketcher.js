require("paper");
var core = require("./core.js");

//core.StationStyle.strokeWidth = 6;
//core.StationStyle.stationRadius = 1.3*6;

var track = core.createTrack();
var snapDistance = 60;


var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};

var station = null;
var path = null;

function onMouseDown(event) {

	var hitResult = project.hitTest(event.point, hitOptions);

	if (hitResult) {
	    console.log('hitresults');
		path = hitResult.item;
//        path.fullySelected = true;
        console.log(path.id);
        station = track.findStation(path.id);
        console.log('station', station);
        if (station) {
            station.toggleSelect();
        }
		if (hitResult.type == 'segment') {
		    console.log('segment');
			segment = hitResult.segment;
        }
		return;
	}

    console.log('onMouseDown');
	var point = new Point(event.point.x, event.point.y);
	if (track.stations.length > 0) {
	    var previousStation = track.stations[track.stations.length-1];
	    if (Math.abs(previousStation.position.x - point.x) < snapDistance) {
	        point.x = previousStation.position.x;
	    }
	    if (Math.abs(previousStation.position.y - point.y) < snapDistance) {
	        point.y = previousStation.position.y;
	    }
	}

	var stationNew = core.createStation(point);
	track.stations.push(stationNew);
	track.draw();
}

function onMouseDrag(event) {
    console.log('mouseDrag');
    console.log('station', station);
	if (station) {
		station.position += event.delta;
	    track.draw();
	}
}

tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;
