require("../metroflow.js");


function createStationContextMenu(stationElementId, onRemoveStation) {
    console.assert(stationElementId);
    $.contextMenu({
        selector: '#' + stationElementId,
        trigger: 'none',
        callback: function(key, options) {
            if (key === "delete") {
                var stationId = $(options.selector).data('station-id');
                onRemoveStation(stationId);
            }
        },
        items: {
            "delete": {name: "Delete", icon: "delete"},
        }
    });
}


function createSegmentContextMenu(segmentElementId, onCreateStationMinor) {
    $.contextMenu({
        selector: '#' + segmentElementId,
        trigger: 'none',
        callback: function(key, options) {
            var segmentId = $(options.selector).data('segment-id');
            if (key === 'createMinorStation') {
                var position = $(options.selector).data('position');
                onCreateStationMinor(position, segmentId);
            }
        },
        items: {
            'createMinorStation': {name: "Add minor station", icon: "add"},
        }
    });
}


module.exports = {
    createStationContextMenu: createStationContextMenu,
    createSegmentContextMenu: createSegmentContextMenu,
};