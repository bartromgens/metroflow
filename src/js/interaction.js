require("paper");
var core = require("./core.js");


function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}

function createStationContextMenu(stationElementId, track) {
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

    var stationObserver = new core.StationObserver(
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

module.exports = {
    createStationElement: createStationElement,
    showStationContextMenu: showStationContextMenu,
};