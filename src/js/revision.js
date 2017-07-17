require("paper");
core = require("./core.js");
serialize = require("./serialize.js");

var maxRevisions = 100;
var revisions = [];
var currentRevision = -1;


function createRevision(map) {
    currentRevision++;
    var mapDataString = serialize.saveMap(map);
    if (currentRevision >= revisions.length) {
        revisions.push(mapDataString);
    } else {
        revisions[currentRevision] = mapDataString;
        revisions.splice(currentRevision+1, revisions.length-currentRevision-1);
    }
    while (revisions.length > maxRevisions) {
        revisions.shift();
        currentRevision--;
    }
    console.log('currentRevision', currentRevision);
}


function undo(map) {
    if (currentRevision <= 0) {
        return map;
    }
    currentRevision--;
    var last = revisions[currentRevision];
    map = serialize.loadMap(JSON.parse(last));
    return map;
}


function redo(map) {
    if (currentRevision+1 >= revisions.length) {
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