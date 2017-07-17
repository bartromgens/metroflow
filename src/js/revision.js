require("paper");
core = require("./core.js");
serialize = require("./serialize.js");

var revisions = [];
var currentRevision = -1;


function createRevision(map) {
    currentRevision++;
    var mapDataString = serialize.saveMap(map);
    if (currentRevision >= revisions.length) {
        revisions.push(mapDataString);
    } else {
        console.log('clear future');
        revisions[currentRevision] = mapDataString;
        revisions.splice(currentRevision+1, revisions.length-currentRevision-1);
    }
    console.log('currentRevision', currentRevision);
}


function undo(map) {
    console.log('revision.undo');
    if (currentRevision <= 0) {
        return map;
    }
    currentRevision--;
    console.log('revisions.length', revisions.length);
    console.log('undo.currentRevision', currentRevision);
    var last = revisions[currentRevision];
    map = serialize.loadMap(JSON.parse(last));
    return map;
}


function redo(map) {
    console.log('revision.redo');
    if (currentRevision+1 >= revisions.length) {
        console.log('revision.redo - NOTHING TO REDO');
        return map;
    }
    currentRevision++;
    var next = revisions[currentRevision];
    map = serialize.loadMap(JSON.parse(next));
    return map;
}


function hasUndo() {
    return currentRevision > 0;
}


function hasRedo() {
    return currentRevision+1 < revisions.length;
}



module.exports = {
    createRevision: createRevision,
    undo: undo,
    redo: redo,
    hasUndo: hasUndo,
    hasRedo: hasRedo
};