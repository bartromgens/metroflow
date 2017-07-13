require("paper");
var core = require("./core.js");
var metrosketcher = require("./sketcher.js");




function setExampleMapAction(callback) {
    $("#button-example-map1").bind("click", callback);
}


function setTrackColorChangeAction(callback) {
    var colorPicker = document.getElementById("track-color-picker");
    colorPicker.addEventListener("input", watchColorPicker, false);
    colorPicker.addEventListener("change", watchColorPicker, false);

    function watchColorPicker(event) {
        var color = event.target.value;
        callback(color);
    }
}


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
    notifyNewStation: notifyNewStation,
    setExampleMapAction: setExampleMapAction,
    setTrackColorChangeAction: setTrackColorChangeAction,
};