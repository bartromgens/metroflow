var MetroFlow = MetroFlow || {}; MetroFlow["sidebar"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
styles = __webpack_require__(2);


var DisplaySettings = {
    isDebug: false,
};


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


var Observable = {
    Observable: function() {
        this.observers = [];
        return this;
    },
    registerObserver: function(observer) {
        var index = this.observers.indexOf(observer);
        if (index === -1) {
            this.observers.push(observer);
        }
    },
    unregisterObserver: function(observer) {
        var index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    },
    notifyAllObservers: function() {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].notify(this);
        }
    },
    notifyBeforeRemove: function() {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].notifyRemove(this);
        }
    },
};


function Observer(notify, notifyRemove) {
    return {
        notify: notify,
        notifyRemove: notifyRemove,
    }
};


module.exports = {
    DisplaySettings: DisplaySettings,
    Observer: Observer,
    Observable: Observable,
    uuidv4: uuidv4,
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = paper;

/***/ }),
/* 2 */
/***/ (function(module, exports) {


var fillColor = "white";
var strokeWidth = 8;
var stationRadius = 1*strokeWidth;
var selectionColor = "green";


var MapStyle = {

};


var TrackStyle = {

};


var SegmentStyle = {
    strokeColor: "red",
    strokeWidth: strokeWidth,
    selectionColor: "green",
    fullySelected: false
};


var StationStyle = {
    strokeColor: "black",
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
        newStyle[ key ] = StationStyle[ key ];
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
};

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(0);


function createStationContextMenu(stationElementId, track) {
    $.contextMenu({
        selector: '#' + stationElementId,
        trigger: 'none',
        callback: function(key, options) {
            if (key === "delete") {
                var stationId = $(options.selector).data('station-id');
                track.removeStation(stationId);
            }
        },
        items: {
            "delete": {name: "Delete", icon: "delete"},
        }
    });
}


function createSegmentContextMenu(segmentElementId, track) {
    $.contextMenu({
        selector: '#' + segmentElementId,
        trigger: 'none',
        callback: function(key, options) {
            var segmentId = $(options.selector).data('segment-id');
            if (key === "create minor station") {
                var position = $(options.selector).data('position');
                track.createStationMinorOnSegmentId(position, segmentId);
            } else if (key === "switchdirection") {
                var stationId = $(options.selector).data('station-id');
                var segment = track.findSegment(segmentId);
                segment.switchDirection();
                track.draw();
            }
        },
        items: {
            "create minor station": {name: "Add minor station", icon: "new"},
            "switchdirection": {name: "Switch direction", icon: ""},
        }
    });
}


module.exports = {
    createStationContextMenu: createStationContextMenu,
    createSegmentContextMenu: createSegmentContextMenu,
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/bart/dev/metroflow/src/js/map.js'\n    at Error (native)");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open '/home/bart/dev/metroflow/src/js/snap.js'\n    at Error (native)");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var core = __webpack_require__(0);
var contextmenu = __webpack_require__(6);


function showStationContextMenu(stationId) {
    $('#station-' + stationId).contextMenu();
}


function showSegmentContextMenu(segmentId, position) {
    $('#segment-' + segmentId).data('position', position);
    $('#segment-' + segmentId).contextMenu();
}


function createStationMinorElement(station, track) {
    var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")
}


function createStationElement(station, track) {
	var stationElementId = "station-" + station.id;
	$("#overlay").append("<div class=\"station\" id=\"" + stationElementId + "\" data-station-id=\"" + station.id + "\"></div>")
    var stationElement = $("#" + stationElementId);

	contextmenu.createStationContextMenu(stationElementId, track);
    updateElementPosition(stationElement, station);
    updateStyle();
    createStationObserver();

    function updateElementPosition(stationElement, station) {
	    stationElement.css('top', (station.position.y - stationElement.width()/2) + 'px');
	    stationElement.css('left', (station.position.x - stationElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            stationElement.css('border-width', '1px');
        } else {
            stationElement.css('border-width', '0px');
        }
    }

    function createStationObserver() {
        var stationObserver = new core.Observer(
            function(station) {
                updateElementPosition(this.stationElement, station);
            },
            function(station) {
                this.stationElement.remove();
            }
        );
        stationObserver.stationElement = stationElement;
        station.registerObserver(stationObserver);
    }
}


function createSegmentElements(track) {
    console.log('createSegmentElements');
    $(".segment").empty();
    for (var i in track.segments) {
        var segment = track.segments[i];
        createSegmentElement(segment, track);
    }
}


function createSegmentElement(segment, track) {
	var segmentElementId = "segment-" + segment.id;
	$("#overlay").append("<div class=\"segment\" id=\"" + segmentElementId + "\" data-segment-id=\"" + segment.id + "\"></div>")
    var segmentElement = $("#" + segmentElementId);

	contextmenu.createSegmentContextMenu(segmentElementId, track);
    updateSegmentElementPosition(segmentElement, segment);
    updateStyle();
    createSegmentObserver();

    function updateSegmentElementPosition(segmentElement, segment) {
	    segmentElement.css('top', (segment.center().y - segmentElement.width()/2) + 'px');
	    segmentElement.css('left', (segment.center().x - segmentElement.height()/2) + 'px');
    }

    function updateStyle() {
        if (core.DisplaySettings.isDebug) {
            segmentElement.css('border-width', '1px');
        } else {
            segmentElement.css('border-width', '0px');
        }
    }

    function createSegmentObserver() {
        var segmentObserver = new core.Observer(
            function(segment) {
                updateSegmentElementPosition(this.segmentElement, segment);
            },
            function(segment) {
                this.segmentElement.remove();
            }
        );
        segmentObserver.segmentElement = segmentElement;
        segment.registerObserver(segmentObserver);
    }
}


module.exports = {
    createStationElement: createStationElement,
    showStationContextMenu: showStationContextMenu,
    showSegmentContextMenu: showSegmentContextMenu,
    createSegmentElements: createSegmentElements,
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var core = __webpack_require__(0);
var metrosketcher = __webpack_require__(12);




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
    $(function() {
        $("#track-width-slider").slider({
            slide: watchSlider,
            change: watchSlider,
            min: 0,
            max: 20,
        });
    });

    function watchSlider(event, ui) {
        callback(ui.value);
    }
}

function setStationRadiusSliderChangeAction(callback) {
    $(function() {
        $("#station-radius-slider").slider({
            slide: watchSlider,
            change: watchSlider,
            min: 0,
            max: 20,
        });
    });

    function watchSlider(event, ui) {
        callback(ui.value);
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
    setTrackWidthSliderChangeAction: setTrackWidthSliderChangeAction,
    setStationRadiusSliderChangeAction: setStationRadiusSliderChangeAction,
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {


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
    setSaveMapAction: setSaveMapAction,
    setLoadMapAction: setLoadMapAction
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
var core = __webpack_require__(0);
var metromap = __webpack_require__(7);
var snap = __webpack_require__(8);
var interaction = __webpack_require__(9);
var sidebar = __webpack_require__(10);
var toolbar = __webpack_require__(11);
var serialize = __webpack_require__(19);


var map = metromap.createMap();

var currentTrack = map.createTrack();
var segmentClicked = null;
var selectedStation = null;


var modes = {
    majorstation: "majorstation",
    minorstation: "minorstation",
    select: "select"
};

var mode = modes.majorstation;


var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 3
};


function setCurrentTrack(track) {
    if (!track) {
        return;
    }
    currentTrack = track;
}


function getStationClicked(hitResult) {
    var path = hitResult.item;
    var result = map.findStationByPathId(path.id);
    var stationClicked = result.station;
    setCurrentTrack(result.track);
    return stationClicked;
}


function getSegmentClicked(hitResult) {
    var path = hitResult.item;
    var segments = path.segments;
    var result = map.findSegmentByPathId(segments[0].path.id);
    var segmentClicked = result.segment;
    setCurrentTrack(result.track);
    return segmentClicked;
}


function onRightClick(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult) {
        return;
    }

    var stationClicked = getStationClicked(hitResult);
    if (stationClicked) {  // right mouse
        interaction.showStationContextMenu(stationClicked.id);
        return;
    }
    var segmentClicked = getSegmentClicked(hitResult);
    if (segmentClicked) {  // right mouse
        interaction.showSegmentContextMenu(segmentClicked.id);
        return;
    }
}


function onClickMajorStationMode(event) {
    console.log('onClickMajorStation');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            console.log('station clicked');
            stationClicked.select();
            selectedStation = stationClicked;
        }
    } else {
        var stationNew = currentTrack.createStation(event.point, selectedStation);
        var position = snap.snapPosition(currentTrack, stationNew, event.point);
        stationNew.setPosition(position);
        selectedStation = stationNew;
        sidebar.notifyNewStation(stationNew, currentTrack);
        interaction.createStationElement(stationNew, currentTrack);
        interaction.createSegmentElements(currentTrack);
        map.draw();
    }
}


function onClickMinorStationMode(event) {
    console.log('onClickMinorStationMode');
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var path = hitResult.item;
        if (hitResult.type === "stroke" || path) {
            console.log('stroke hit');
            segmentClicked = getSegmentClicked(hitResult);
            if (segmentClicked) {
                currentTrack.createStationMinorOnSegmentId(event.point, segmentClicked.id);
                map.draw();
            } else {
                console.log('warning: no segment clicked');
            }
        }
    }
}


function onClickSelectMode(event) {
    var hitResult = project.hitTest(event.point, hitOptions);
    if (hitResult) {
        var stationClicked = getStationClicked(hitResult);
        if (stationClicked) {
            stationClicked.toggleSelect();
            selectedStation = stationClicked;
            return;
        }
        var segmentClicked = getSegmentClicked(hitResult);
        if (segmentClicked) {
            segmentClicked.toggleSelect();
            return;
        }
    }
}


function onMouseDown(event) {
    if (event.event.which === 3) {  // right mouse
        onRightClick(event);
        return;
    }

    if (mode === modes.majorstation) {
        onClickMajorStationMode(event);
    } else if (mode === modes.minorstation) {
        selectedStation = null;
        onClickMinorStationMode(event);
    } else if (mode === modes.select) {
        onClickSelectMode(event);
    }
}


function onMouseDrag(event) {
	if (selectedStation) {
	    var position = snap.snapPosition(currentTrack, selectedStation, event.point);
        selectedStation.setPosition(position);
	    map.draw();
	}
}


function onKeyDown(event) {
    if (event.key === 'd') {
        console.log('d key pressed');
        core.DisplaySettings.isDebug = !core.DisplaySettings.isDebug;
        map.draw();
        if (core.DisplaySettings.isDebug) {
            $(".station").css('border-width', '1px');
            $(".segment").css('border-width', '1px');
        } else {
            $(".station").css('border-width', '0px');
            $(".segment").css('border-width', '0px');
        }
    }
}


function initialiseToolbarActions() {
    console.log('initialiseToolbarActions');
    function majorStationButtonClicked() {
        console.log('major station drawing selected');
        mode = modes.majorstation;
    }

    function minorStationButtonClicked() {
        console.log('minor station drawing selected');
        mode = modes.minorstation;
    }

    function selectButtonClicked() {
        console.log('selection mode selected');
        mode = modes.select;
    }

    function newTrackButtonClicked() {
        console.log('new track button clicked');
        var newTrack = map.createTrack();
        var segmentStyle = styles.createSegmentStyle();
        segmentStyle.strokeColor = "blue";
        newTrack.segmentStyle = segmentStyle;
        currentTrack = newTrack;
    }

    function saveMapClicked() {
        console.log('save map button clicked');
        var mapJSONString = serialize.saveMap(map);
        var data = "text/json;charset=utf-8," + encodeURIComponent(mapJSONString);
        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';

        // var container = document.getElementById('toolbar');
        // container.appendChild(a);
        a.click();
    }

    function loadMapClicked(event) {
        console.log('load map button clicked');
        readSingleFile(event);

        function readSingleFile(event) {
            var file = event.target.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                var contents = event.target.result;
                displayContents(contents);
            };
            reader.readAsText(file);
        }

        function displayContents(contents) {
            map = serialize.loadMap(JSON.parse(contents));
            map.draw();
        }
    }

    function loadJSONMap(filepath) {
        $.getJSON(filepath, function(json) {
            console.log(json);
            map = serialize.loadMap(json);
            map.draw();
        });
    }

    function loadExampleMapClicked() {
        loadJSONMap("src/maps/test1.json");
    }

    function onTrackColorChanged(color) {
        console.log('onTrackColorChanged');
        var segmentStyle = currentTrack.segmentStyle;
        segmentStyle.strokeColor = color;
        currentTrack.setSegmentStyle(segmentStyle);
        map.draw();
    }

    function onTrackWidthChanged(value) {
        var segmentStyle = currentTrack.segmentStyle;
        segmentStyle.strokeWidth = value;
        currentTrack.setSegmentStyle(segmentStyle);
        map.draw();
    }

    function onStationRadiusChanged(radius) {
        currentTrack.setStationRadius(radius);
        map.draw();
    }

    toolbar.setMajorStationButtonAction(majorStationButtonClicked);
    toolbar.setMinorStationButtonAction(minorStationButtonClicked);
    toolbar.setSelectButtonAction(selectButtonClicked);
    toolbar.setNewTrackButtonAction(newTrackButtonClicked);
    toolbar.setSaveMapAction(saveMapClicked);
    toolbar.setLoadMapAction(loadMapClicked);

    sidebar.setExampleMapAction(loadExampleMapClicked);
    sidebar.setTrackColorChangeAction(onTrackColorChanged);
    sidebar.setTrackWidthSliderChangeAction(onTrackWidthChanged);
    sidebar.setStationRadiusSliderChangeAction(onStationRadiusChanged);
}


$(initialiseToolbarActions);


tool.onMouseDown = onMouseDown;
tool.onMouseDrag = onMouseDrag;
tool.onKeyDown = onKeyDown;






/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var metromap = __webpack_require__(7);


function saveMap(map) {
    var mapData = {};
    mapData.tracks = [];
    for (var i in map.tracks) {
        var trackData = createTrackData(map.tracks[i]);
        mapData.tracks.push(trackData);
    }
    console.log(mapData);
    var mapJSONString = JSON.stringify(mapData);
    return mapJSONString;
}


function createTrackData(track) {
    var trackData = {};
    trackData.id = track.id;
    trackData.segmentStyle = track.segmentStyle;
    trackData.stations = [];
    trackData.stationsMinor = [];
    for (var j in track.stations) {
        var stationData = createStationData(track.stations[j]);
        trackData.stations.push(stationData)
    }
    for (var j in track.stationsMinor) {
        var stationData = createStationMinorData(track.stationsMinor[j]);
        trackData.stationsMinor.push(stationData)
    }
    return trackData;
}


function createStationData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
    };
    return stationData;
}


function createStationMinorData(station) {
    var stationData = {
        position: {x: station.position.x, y: station.position.y},
        id: station.id,
        name: station.name,
        stationA: station.stationA.id,
        stationB: station.stationB.id,
    };
    return stationData;
}

function loadMap(mapJSON) {
    console.log('loadMap');
    if (!mapJSON) {
        // mapJSON = '{"tracks":[{"id":"15479b48-a900-438b-a0fa-2da8c77729af","stations":[{"position":{"x":200,"y":165},"id":"b4212813","name":"station"},{"position":{"x":535,"y":424},"id":"adc99f13","name":"station"},{"position":{"x":806,"y":119},"id":"ebad26f4","name":"station"}],"stationsMinor":[{"position":{"x":274.22056274847716,"y":269.22056274847716},"id":"712c3721","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":341.3700576850888,"y":336.3700576850888},"id":"fb50a4e2","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":408.5195526217004,"y":403.5195526217004},"id":"6c52a2bb","name":"station","stationA":"b4212813","stationB":"adc99f13"},{"position":{"x":634.7959415460184,"y":354.2040584539816},"id":"2f8dadac","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":697.5208152801713,"y":291.4791847198287},"id":"f99d3a55","name":"station","stationA":"adc99f13","stationB":"ebad26f4"},{"position":{"x":760.2456890143242,"y":228.7543109856758},"id":"61b3fb5a","name":"station","stationA":"adc99f13","stationB":"ebad26f4"}]},{"id":"e93fb48a-518f-4f29-aa6f-1e395233cc09","stations":[{"position":{"x":209,"y":104},"id":"ce3ea5bf","name":"station"},{"position":{"x":400,"y":104},"id":"2ce21052","name":"station"},{"position":{"x":928,"y":354},"id":"292957b8","name":"station"}],"stationsMinor":[{"position":{"x":272.6666666666667,"y":104},"id":"6fee351c","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":336.3333333333333,"y":104},"id":"325fe14a","name":"station","stationA":"ce3ea5bf","stationB":"2ce21052"},{"position":{"x":542.2817459305202,"y":104},"id":"074eef3a","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":684.5634918610405,"y":104},"id":"1fba151c","name":"station","stationA":"2ce21052","stationB":"292957b8"},{"position":{"x":820.3205448016022,"y":216.3205448016022},"id":"5a39e0ba","name":"station","stationA":"2ce21052","stationB":"292957b8"}]}]}'
        mapJSON = '{"tracks":[{"id":"3794c750-6605-49df-b810-aa5b0ebb42e8","segmentStyle":{"strokeColor":"red","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":152,"y":239},"id":"3fe7243d","name":"station"},{"position":{"x":687,"y":495},"id":"995a2376","name":"station"}],"stationsMinor":[]},{"id":"6fe22ae9-cd61-4705-aa2d-c457e11901e9","segmentStyle":{"strokeColor":"blue","strokeWidth":8,"selectionColor":"green","fullySelected":false},"stations":[{"position":{"x":174,"y":142},"id":"8cb86074","name":"station"},{"position":{"x":764,"y":433},"id":"882322b8","name":"station"}],"stationsMinor":[]}]}';
        mapJSON = JSON.parse(mapJSON);
    }
    var map = metromap.createMap();
    for (var i in mapJSON.tracks) {
        var track = loadTrack(map, mapJSON.tracks[i]);
    }
    return map;
}


function loadTrack(map, trackData) {
    var track = map.createTrack();
    track.id = trackData.id;
    track.setSegmentStyle(trackData.segmentStyle);
    var previousStation = null;
    for (var j in trackData.stations) {
        var stationData = trackData.stations[j];
        var station = track.createStation(new Point(stationData.position.x, stationData.position.y), previousStation);
        station.id = stationData.id;
        previousStation = station;
    }
    for (var j in trackData.stationsMinor) {
        var stationData = trackData.stationsMinor[j];
        var stationA = track.findStation(stationData.stationA);
        var stationB = track.findStation(stationData.stationB);
        var station = track.createStationMinorBetweenStations(stationA, stationB);
        station.id = stationData.id;
    }
    return track;
}


module.exports = {
    saveMap: saveMap,
    loadMap: loadMap,
};

/***/ })
/******/ ]);