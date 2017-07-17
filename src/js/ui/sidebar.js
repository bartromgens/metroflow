require("paper");
var core = require("../core.js");
var metrosketcher = require("../sketcher.js");

var currentTrack = null;


function setCurrentTrack(track) {
    if (currentTrack && currentTrack.id === track.id) {
        return;
    }
    currentTrack = track;
    var colorPicker = document.getElementById("track-color-picker");
    colorPicker.value = track.segmentStyle.strokeColor;
    document.getElementById("station-stroke-color-picker").value = track.stationStyle.strokeColor;

    $("#track-width-slider").slider('value', track.segmentStyle.strokeWidth);
    $("#station-radius-slider").slider('value', track.stationStyle.stationRadius);
    $("#station-stroke-width-slider").slider('value', track.stationStyle.strokeWidth);
}


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


function setTrackWidthSliderChangeAction(callback) {
    $("#track-width-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        console.log(ui.value);
        callback(ui.value);
    }
}


function setStationRadiusSliderChangeAction(callback) {
    $("#station-radius-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        callback(ui.value);
    }
}

function setStationStrokeWidthSliderChangeAction(callback) {
    $("#station-stroke-width-slider").slider({
        slide: watchSlider,
        change: watchSlider,
        min: 0,
        max: 20,
        step: 0.5,
    });

    function watchSlider(event, ui) {
        callback(ui.value);
    }
}



function setStationStrokeColorChangeAction(callback) {
    var colorPicker = document.getElementById("station-stroke-color-picker");
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
    setCurrentTrack: setCurrentTrack,
    setTrackColorChangeAction: setTrackColorChangeAction,
    setTrackWidthSliderChangeAction: setTrackWidthSliderChangeAction,
    setStationRadiusSliderChangeAction: setStationRadiusSliderChangeAction,
    setStationStrokeWidthSliderChangeAction: setStationStrokeWidthSliderChangeAction,
    setStationStrokeColorChangeAction: setStationStrokeColorChangeAction,
};