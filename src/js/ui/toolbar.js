
$(function() {
    var buttonMajorStation = $("#button-major-station");
    var buttonMinorStation = $("#button-minor-station");
    var buttonSelect = $("#button-select");

    buttonMajorStation.bind("click", function () {
        console.log('major button');
    });

    buttonMinorStation.bind("click", function () {
        console.log('minor button');
    });
});

function setMajorStationButtonAction(callback) {
    var buttonMajorStation = $("#button-major-station");
    buttonMajorStation.bind("click", callback);
}

function setMinorStationButtonAction(callback) {
    var buttonMinorStation = $("#button-minor-station");
    buttonMinorStation.bind("click", callback);
}

function setSelectButtonAction(callback) {
    var buttonSelect = $("#button-select");
    buttonSelect.bind("click", callback);
}

function setNewTrackButtonAction(callback) {
    var buttonNewTrack = $("#button-new-track");
    buttonNewTrack.bind("click", callback);
}

function setNewConnectionAction(callback) {
    var buttonNewConnection = $("#button-new-connection");
    buttonNewConnection.bind("click", callback);
}

function setUndoAction(callback) {
    $("#button-undo").bind("click", callback);
}

function setRedoAction(callback) {
    $("#button-redo").bind("click", callback);
}

function setCalcTextPositionsAction(callback) {
    $("#button-calc-text-positions").bind("click", callback);
}

function setToggleSnapAction(callback) {
    $("#checkbox-snap").bind("click", callback);
}

function setSaveMapAction(callback) {
    var button = $("#button-save-map");
    button.bind("click", callback);
}

function setLoadMapAction(callback) {
    document.getElementById('file-input')
        .addEventListener('change', callback, false);
}


module.exports = {
    setMajorStationButtonAction: setMajorStationButtonAction,
    setMinorStationButtonAction: setMinorStationButtonAction,
    setSelectButtonAction: setSelectButtonAction,
    setNewTrackButtonAction: setNewTrackButtonAction,
    setNewConnectionAction: setNewConnectionAction,
    setUndoAction: setUndoAction,
    setRedoAction: setRedoAction,
    setToggleSnapAction: setToggleSnapAction,
    setCalcTextPositionsAction: setCalcTextPositionsAction,
    setSaveMapAction: setSaveMapAction,
    setLoadMapAction: setLoadMapAction
};