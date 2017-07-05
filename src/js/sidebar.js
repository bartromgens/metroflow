require("paper");
var core = require("./core.js");

//
// function showStations(track) {
//     var sideBar = $("#sidebar");
//     sideBar.empty();
//     for (var i in track.stations) {
//         var station = track.stations[i];
//         sideBar.append("<span><small>Station " + station.id + "</small></span>");
//         sideBar.append("<span><small> (" + station.position.x + ", " + station.position.y + ")</small></span>");
//         sideBar.append("<br/>");
//     }
// }


function showTracks(tracks) {
    var sideBar = $("#sidebar");
}


function notifyNewStation(station, track) {
    var stationObserver = new core.Observer(
        function(station) {
            // showStations(track);
        },
        function(station) {
            // showStations(track);
        }
    );
    station.registerObserver(stationObserver);
}


module.exports = {
    notifyNewStation: notifyNewStation
};