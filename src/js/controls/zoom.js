require("paper");

var map = null;

function setNewMap(newMap) {
    map = newMap;
}

function enableZoomOnCanvas(newMap) {
    map = newMap;
    $("canvas").bind("wheel", function(event) {
        var point = new Point(event.clientX, event.clientY);
        zoom(-event.originalEvent.deltaY, point);

        function allowedZoom(zoom) {
            if (zoom !== paper.view.zoom)
            {
                paper.view.zoom = zoom;
                return zoom;
            }
            return null;
        }

        function zoom(delta, point) {
            if (!delta) return;

            var oldZoom = paper.view.zoom;
            var oldCenter = paper.view.center;
            var viewPos = paper.view.viewToProject(point);
            var newZoom = delta > 0 ? oldZoom * 1.05 : oldZoom / 1.05;

            if (!allowedZoom(newZoom)) {
                return;
            }

            var zoomScale = oldZoom / newZoom;
            var centerAdjust = viewPos.subtract(oldCenter);
            var offset = viewPos.subtract(centerAdjust.multiply(zoomScale)).subtract(oldCenter);

            paper.view.center = view.center.add(offset);

            map.notifyAllStationsAndSegments();
        }
    });
}

module.exports = {
    enableZoomOnCanvas: enableZoomOnCanvas,
    setNewMap: setNewMap,
};
