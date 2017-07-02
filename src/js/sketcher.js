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


var StationObserver = function() {
    return {
        notify: function(station) {
            console.log('notify');
            this.stationElement.css('top', (station.position.y-10) + 'px');
            this.stationElement.css('left', (station.position.x-15) + 'px');
        },
        notifyRemove: function(station) {
            this.stationElement.remove();
        }
    }
}


function onMouseDown(event) {
    console.log('key', event.event.which);

	var hitResult = project.hitTest(event.point, hitOptions);

	if (hitResult) {
	    console.log('hitresults');
		path = hitResult.item;
//        path.fullySelected = true;
        console.log(path.id);
        station = track.findStationByPathId(path.id);
        console.log('station', station);
        if (station) {
            if ( event.event.which == 3 ) {
                $('#station-' + station.id).contextMenu();
                return;
            }
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
	var stationElementId = "station-" + stationNew.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + stationNew.id + "\"></div>")

    $(function(){
        $.contextMenu({
            selector: '#' + stationElementId,
            trigger: 'none',
            callback: function(key, options) {
                if (key == "delete") {
                    console.log(options);
                    var stationId = $(options.selector).data('station-id');
                    console.log('delete station:', stationId);
                    track.removeStation(stationId);
                }
            },
            items: {
                "delete": {name: "Delete", icon: "delete"},
//                "sep1": "---------",
//                "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
            }
        });
    });

    var stationElement = $("#" + stationElementId);
	stationElement.css('top', (point.y-10) + 'px');
	stationElement.css('left', (point.x-15) + 'px');
	track.stations.push(stationNew);
	track.draw();

	var stationObserver = new StationObserver();
	stationObserver.stationElement = stationElement;
	stationNew.registerObserver(stationObserver);
}

function onMouseDrag(event) {
    console.log('mouseDrag');
    console.log('station', station);
	if (station) {
	    station.setPosition(station.position + event.delta);
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