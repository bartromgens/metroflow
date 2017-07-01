require("paper");
var core = require("./core.js");

//core.StationStyle.strokeWidth = 6;
//core.StationStyle.stationRadius = 1.3*6;

var track = core.createTrack();

function onMouseDown(event) {
    console.log('onMouseDown');
	// Add a segment to the path at the position of the mouse:
	var point = new Point(event.point.x, event.point.y);
	var station = core.createStation(point);
	console.log('station', station);
	console.log('track', track);
	if (track.stations.length > 0) {
	    var segment = core.createSegment(track.stations[track.stations.length-1].point, station.point);
	    track.segments.push(segment);
	}
	track.stations.push(station);
	track.draw();
}

tool.onMouseDown = onMouseDown;
