var core = require("./core.js");


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


module.exports = {
    createStationContextMenu: createStationContextMenu,
    createSegmentContextMenu: createSegmentContextMenu,
};