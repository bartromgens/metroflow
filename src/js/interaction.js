require("paper");
var util = require("./util.js");


var map = null;

function setCurrentMap(currentMap) {
    map = currentMap;
}

function showStationContextMenu(stationId) {
    $('#' + stationId).contextMenu();
}


function showStationInfo(station) {
    var $div = $('<div class="station-info">id:' + station.id + '</div>');
    $div.css('top', $('#' + station.id).css("top"));
    $div.css('left', $('#' + station.id).css("left"));
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
	$("#overlay").append("<div class=\"station\" id=\"" + station.id + "\" data-station-id=\"" + station.id + "\"></div>")
}


function createMapElements(map, onRemoveStation) {
    $("#overlay").empty();
    var mapElements = [];
    for (var i in map.tracks) {
        var trackElements = createTrackElements(map.tracks[i], onRemoveStation);
        mapElements.push({track: map.tracks[i], stationElements: trackElements.stationElements, segmentElements: trackElements.segmentElements});
    }
    return mapElements
}


function createTrackElements(track) {
    var stationElements = [];
    for (var i in track.stations) {
        var stationElement = createStationElement(track.stations[i], track);
        stationElements.push(stationElement);
    }
    var segmentElements = createSegmentElements(track);
    return {stationElements: stationElements, segmentElements: segmentElements};
}


function createStationElement(station, track) {
	$("#overlay").append("<div class=\"station\" id=\"" + station.id + "\" data-station-id=\"" + station.id + "\"></div>")
    var stationElement = $("#" + station.id);

    updateElementPosition(stationElement, station);
    updateStyle();
    createStationObserver();

    function updateElementPosition(stationElement, station) {
        var viewPosition = paper.view.projectToView(station.position);
	    stationElement.css('top', (viewPosition.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (viewPosition.x - stationElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (util.DisplaySettings.isDebug) {
            stationElement.css('border-width', '1px');
        } else {
            stationElement.css('border-width', '0px');
        }
    }

    function createStationObserver() {
        var stationObserver = new util.Observer(
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
    return stationElement;
}


function createSegmentElements(track) {
    console.log('createSegmentElements');
    $(".segment").empty();
    var elements = [];
    for (var i in track.segments) {
        var segment = track.segments[i];
        var element = createSegmentElement(segment, track);
        elements.push(element);
    }
    return elements;
}


function createSegmentElement(segment, track) {
	var segmentElementId = "segment-" + segment.id;
	$("#overlay").append("<div class=\"segment\" id=\"" + segmentElementId + "\" data-segment-id=\"" + segment.id + "\"></div>")
    var segmentElement = $("#" + segmentElementId);

    updateSegmentElementPosition(segmentElement, segment);
    updateStyle();
    createSegmentObserver();

    function updateSegmentElementPosition(segmentElement, segment) {
        var segmentCenterView = paper.view.projectToView(segment.center());
	    segmentElement.css('top', (segmentCenterView.y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segmentCenterView.x - segmentElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (util.DisplaySettings.isDebug) {
            segmentElement.css('border-width', '1px');
        } else {
            segmentElement.css('border-width', '0px');
        }
    }

    function createSegmentObserver() {
        var segmentObserver = new util.Observer(
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

    return segmentElement;
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