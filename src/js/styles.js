
var fillColor = "white";
var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var selectionColor = rgbToHex(0, 100, 0);


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


var MapStyle = {

};


var TrackStyle = {

};


var SegmentStyle = {
    strokeColor: rgbToHex(255, 0, 0),
    strokeWidth: strokeWidth,
    selectionColor: selectionColor,
    fullySelected: false
};


var StationStyle = {
    strokeColor: rgbToHex(0, 0, 0),
    strokeWidth: strokeWidth/2,
    fillColor: fillColor,
    stationRadius: stationRadius,
    selectionColor: selectionColor,
    fullySelected: false
};


var StationMinorStyle = {
    strokeColor: SegmentStyle.strokeColor,
    strokeWidth: SegmentStyle.strokeWidth,
    selectionColor: selectionColor,
    minorStationSize: SegmentStyle.strokeWidth * 2.0,
    fullySelected: false
};


function createStationStyle() {
    var newStyle = {};
    Object.keys(StationStyle).forEach(function(key) {
        newStyle[key] = StationStyle[key];
    });
    return newStyle;
}

function createStationMinorStyle() {
    var newStyle = {};
    Object.keys(StationMinorStyle).forEach(function(key) {
        newStyle[key] = StationMinorStyle[key];
    });
    return newStyle;
}

function createSegmentStyle() {
    var newStyle = {};
    Object.keys(SegmentStyle).forEach(function(key) {
        newStyle[key] = SegmentStyle[key];
    });
    return newStyle;
}


module.exports = {
    createStationStyle: createStationStyle,
    createSegmentStyle: createSegmentStyle,
    createStationMinorStyle: createStationMinorStyle,
    rgbToHex: rgbToHex,
};