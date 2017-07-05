
var fillColor = "white";
var strokeWidth = 8;
var stationRadius = 1*strokeWidth;


var MapStyle = {

};

var TrackStyle = {

};


var SegmentStyle = {
    strokeColor: "red",
    strokeWidth: strokeWidth,
    selectionColor: "green",
    fullySelected: false,
};


var StationStyle = {
    strokeColor: "black",
    strokeWidth: strokeWidth/2,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: "green",
    fullySelected: false,
};

var StationMinorStyle = {
    strokeColor: "red",
    strokeWidth: strokeWidth,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: "green",
    fullySelected: false,
};


function createStationStyle() {
    return Object.create(StationStyle);
}

function createStationMinorStyle() {
    return Object.create(StationMinorStyle);
}

function createSegmentStyle() {
    return Object.create(SegmentStyle);
}


module.exports = {
    createStationStyle: createStationStyle,
    createSegmentStyle: createSegmentStyle,
    createStationMinorStyle: createStationMinorStyle,
};