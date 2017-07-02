require("paper");
var core = require("./core.js");

//core.StationStyle.strokeWidth = 6;
//core.StationStyle.stationRadius = 1.3*6;

var track = core.createTrack();
var snapDistance = 60;

function onMouseDown(event) {

    var hitOptions = {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
    };

	var hitResult = project.hitTest(event.point, hitOptions);

	if (hitResult) {
	    console.log('hitresults');
		var path = hitResult.item;
//        path.fullySelected = true;
        console.log(path.id);
        var station = track.findStation(path.id);
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
	    if (Math.abs(previousStation.point.x - point.x) < snapDistance) {
	        point.x = previousStation.point.x;
	    }
	    if (Math.abs(previousStation.point.y - point.y) < snapDistance) {
	        point.y = previousStation.point.y;
	    }
	}
	var station = core.createStation(point);

	if (previousStation) {
	    var segment = core.createSegment(previousStation.point, station.point);
	    track.segments.push(segment);
	}

	track.stations.push(station);
	track.draw();
}

tool.onMouseDown = onMouseDown;
