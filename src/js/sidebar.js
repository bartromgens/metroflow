require("paper");
var core = require("./core.js");

function showStations(track) {
    $("#sidebar").empty();
    for (var i in track.stations) {
        var station = track.stations[i];
        $("#sidebar").append("<span><small>Station " + station.id + "</small></span>");
        $("#sidebar").append("<span><small> (" + station.position.x + ", " + station.position.y + ")</small></span>");
        $("#sidebar").append("<br/>");
    }
}

module.exports = {
    showStations: showStations,
};