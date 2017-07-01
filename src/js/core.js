require("paper");

var isDebug = false;

var StationStyle = {
    strokeColor: "black",
    strokeWidth: 6,
    fillColor: "white",
    stationRadius: 1.3*this.strokeWidth,
    fullySelected: isDebug,
}

var Station = {
    Station: function(point, stationRadius) {
        this.station = new Path.Circle(point, StationStyle.stationRadius);
        this.station.strokeColor = StationStyle.strokeColor;
        this.station.strokeWidth = StationStyle.strokeWidth;
        this.station.fillColor = StationStyle.fillColor;
        this.station.fullySelected = StationStyle.isDebug;
    }
}


function createStation(point) {
    return Object.create(Station).Station(point);
}

module.exports = {
    createStation: createStation,
    StationStyle: StationStyle
};