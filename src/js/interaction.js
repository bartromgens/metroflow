require("paper");
var core = require("./core.js");
var contextmenu = require("./sketcher/contextmenu.js");

var map = null;

function setCurrentMap(currentMap) {
    map = currentMap;
}

function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}


function showStationInfo(station) {
    var $div = $('<div class="station-info">id:' + station.id + '</div>');
    $div.css('top', $('#station-' + station.id).css("top"));
    $div.css('left', $('#station-' + station.id).css("left"));
    $('#overlay-content').append($div);
}


function hideStationInfoAll() {
    $(".station-info").hide();
}


function showSegmentContextMenu(segmentId, position) {
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
}


function createStationMinorElement(station, track) {
    var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")
}


function createMapElements(map, onRemoveStation) {
    $("#overlay").empty();
    for (var i in map.tracks) {
        createTrackElements(map.tracks[i], onRemoveStation);
    }
}


function createTrackElements(track, onRemoveStation) {
    for (var i in track.stations) {
        createStationElement(track.stations[i], track, onRemoveStation);
    }
    createSegmentElements(track);
    // for (var i in track.stationsMinor) {
    //     createStationMinorElement(track.stationsMinor[i], track);
    // }
}


function createStationElement(station, track, onRemoveStation) {
	var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")
    var stationElement = $("#" + stationElementId);

	contextmenu.createStationContextMenu(stationElementId, track, map, onRemoveStation);
    updateElementPosition(stationElement, station);
    updateStyle();
    createStationObserver();

    function updateElementPosition(stationElement, station) {
	    stationElement.css('top', (station.position.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (station.position.x - stationElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            stationElement.css('border-width', '1px');
        } else {
            stationElement.css('border-width', '0px');
        }
    }

    function createStationObserver() {
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
    var segmentElement = $("#" + segmentElementId);

	contextmenu.createSegmentContextMenu(segmentElementId, track);
    updateSegmentElementPosition(segmentElement, segment);
    updateStyle();
    createSegmentObserver();

    function updateSegmentElementPosition(segmentElement, segment) {
	    segmentElement.css('top', (segment.center().y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segment.center().x - segmentElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            segmentElement.css('border-width', '1px');
        } else {
            segmentElement.css('border-width', '0px');
        }
    }

    function createSegmentObserver() {
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
}


module.exports = {
    createMapElements: createMapElements,
    createTrackElements: createTrackElements,
    createStationElement: createStationElement,
    showStationInfo: showStationInfo,
    hideStationInfoAll: hideStationInfoAll,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
    setCurrentMap: setCurrentMap,
};