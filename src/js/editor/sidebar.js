require("paper");
require("../metroflow.js");

var currentTrack = null;


function setCurrentTrack(track) {
    if (currentTrack && currentTrack.id === track.id) {
        return;
    }
    var colorPicker = document.getElementById("track-color-picker");
    colorPicker.value = track.segmentStyle.strokeColor;
    document.getElementById("station-stroke-color-picker").value = track.stationStyle.strokeColor;

    $("#track-width-slider").slider('value', track.segmentStyle.strokeWidth);
    $("#station-radius-slider").slider('value', track.stationStyle.stationRadius);
    $("#station-stroke-width-slider").slider('value', track.stationStyle.strokeWidth);

    currentTrack = track;
    updateTableTrack(track);
}


function setExampleMapAction(callback) {
    $("#button-example-map1").bind("click", loadFilename);
    $("#button-example-map2").bind("click", loadFilename);

    function loadFilename() {
        var filename = $(this).data("filename");
        console.log(filename);
        callback(filename);
    }
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



function showTracks(tracks) {
    var sideBar = $("#sidebar");
}


function updateTableTrack(track) {
    console.log('TrackObserver.trackChanged()');
    if (!currentTrack || currentTrack.id !== track.id) {
        return;
    }
    $("#track-table tbody").empty();
    for (var i in track.stations) {
        var station = track.stations[i];
        addStationRow(station);
    }

    function addStationRow(station) {
        var markup = "<tr><td><input id='station-row-" + station.id + "' type='text' name='station' value='" + station.name + "' data-stationid='" + station.id + "'></td></tr>";
        $("#track-table tbody").append(markup);
        $("#station-row-" + station.id).bind("change", stationNameInputChange)
    }

    function stationNameInputChange() {
        console.log("stationNameInputChange");
        var stationId = $(this).data("stationid");
        console.log('stationid', stationId);
        var station = track.findStation(stationId);
        console.log('station', station);
        console.log('value', $(this).val());
        station.name = $(this).val();
        signalTrackInfoChanged(currentTrack);
    }
}


function notifyTrackChanged(track) {
    var trackObserver = new util.Observer(
        updateTableTrack,
        function(track) {
            return;
        }
    );
    track.registerObserver(trackObserver);
}


var signalTrackInfoChanged = null;

function setTrackChangeAction(callback) {
    signalTrackInfoChanged = callback;
}

function setToggleDebugAction(callback) {
    $("#checkbox-debug").bind("click", callback);
}

function setToggleMinorNamesAction(callback) {
    $("#checkbox-minor-station-names").bind("click", callback);
}


module.exports = {
    notifyTrackChanged: notifyTrackChanged,
    setExampleMapAction: setExampleMapAction,
    setCurrentTrack: setCurrentTrack,
    setTrackColorChangeAction: setTrackColorChangeAction,
    setTrackWidthSliderChangeAction: setTrackWidthSliderChangeAction,
    setStationRadiusSliderChangeAction: setStationRadiusSliderChangeAction,
    setStationStrokeWidthSliderChangeAction: setStationStrokeWidthSliderChangeAction,
    setStationStrokeColorChangeAction: setStationStrokeColorChangeAction,
    setTrackChangeAction: setTrackChangeAction,
    setToggleDebugAction: setToggleDebugAction,
    setToggleMinorNamesAction: setToggleMinorNamesAction,
};