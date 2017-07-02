require("paper");
var core = require("./core.js");


function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}


function showSegmentContextMenu(segmentId, position) {
    console.log('test', position);
    console.log($('#segment-' + segmentId));
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
    console.log('test');
}


function createStationContextMenu(stationElementId, track) {
    $.contextMenu({
        selector: '#' + stationElementId,
        trigger: 'none',
        callback: function(key, options) {
            if (key == "delete") {
                var stationId = $(options.selector).data('station-id');
                track.removeStation(stationId);
            }
        },
        items: {
            "delete": {name: "Delete", icon: "delete"},
        }
    });
}


function createSegmentContextMenu(segmentElementId, track) {
    $.contextMenu({
        selector: '#' + segmentElementId,
        trigger: 'none',
        callback: function(key, options) {
            console.log('options', options);
            if (key == "create minor station") {
                var segmentId = $(options.selector).data('segment-id');
                var position = $(options.selector).data('position');
                track.createStationMinor(position, segmentId);
            }
        },
        items: {
            "create minor station": {name: "create minor station", icon: "new"},
        }
    });
}


function createStationElement(station, track) {
	var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")

	createStationContextMenu(stationElementId, track);

    var stationElement = $("#" + stationElementId);

    function updateElementPosition(stationElement, station) {
	    stationElement.css('top', (station.position.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (station.position.x - stationElement.height()/2) + 'px');
    }
    updateElementPosition(stationElement, station);

    if (core.DisplaySettings.isDebug) {
        stationElement.css('border-width', '1px');
    } else {
        stationElement.css('border-width', '0px');
    }

    var stationObserver = new core.Observer(
        function(station) {
            updateElementPosition(this.stationElement, station);
        },
        function(station) {
            this.stationElement.remove();
        }
    );
	stationObserver.stationElement = stationElement;
	station.registerObserver(stationObserver);
}


function createSegmentElements(track) {
    console.log('createSegmentElements');
    $(".segment").empty();
    for (var i in track.segments) {
        var segment = track.segments[i];
        createSegmentElement(segment, track);
    }
}


function createSegmentElement(segment, track) {
	var segmentElementId = "segment-" + segment.id;
	$("#overlay").append("<div class=\"segment\" id=\"" + segmentElementId + "\" data-segment-id=\"" + segment.id + "\"></div>")

	createSegmentContextMenu(segmentElementId, track);

    var segmentElement = $("#" + segmentElementId);

    function updateSegmentElementPosition(segmentElement, segment) {
	    segmentElement.css('top', (segment.center().y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segment.center().x - segmentElement.height()/2) + 'px');
    }
    updateSegmentElementPosition(segmentElement, segment);

    if (core.DisplaySettings.isDebug) {
        segmentElement.css('border-width', '1px');
    } else {
        segmentElement.css('border-width', '0px');
    }

    var segmentObserver = new core.Observer(
        function(segment) {
            updateSegmentElementPosition(this.segmentElement, segment);
        },
        function(segment) {
            this.segmentElement.remove();
        }
    );
	segmentObserver.segmentElement = segmentElement;
	segment.registerObserver(segmentObserver);
}

module.exports = {
    createStationElement: createStationElement,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
};