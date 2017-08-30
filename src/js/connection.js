util = require("./util.js");
styles = require("./styles.js");


var Connection = {
    Connection: function(stationA, stationB) {
        this.stationA = stationA;
        this.stationB = stationB;
        this.id = util.uuidv4();
        this.paths = [];
        return this;
    },
    allPaths: function() {
        return this.paths;
    },
    draw: function() {
        var stationRadiusA = this.stationA.style.stationRadius;
        var stationRadiusB = this.stationB.style.stationRadius;
        var stationStrokeWidthA = this.stationA.style.strokeWidth;
        var stationStrokeWidthB = this.stationB.style.strokeWidth;
        var stationStrokeWidth = Math.min(stationStrokeWidthA, stationStrokeWidthB);
        var stationRadius = Math.min(stationRadiusA, stationRadiusB);
        var difference = this.stationB.position - this.stationA.position;
        var size = new Size(difference.length-stationRadius, stationRadius-stationStrokeWidth/2);
        var offset = new Point(-stationRadius/2, stationRadius/2-stationStrokeWidth/4);
        var rectangle = new Path.Rectangle(this.stationA.position - offset, size);
        rectangle.fillColor = styles.rgbToHex(255, 255, 255);
        rectangle.strokeWidth = 0;
        rectangle.rotate(difference.angle, this.stationA.position);
        var offset = difference.normalize().rotate(90) * stationRadius/2;
        var offsetA1 = offset + difference.normalize()*(stationRadiusA-stationStrokeWidthA/2);
        var offsetB1 = offset - difference.normalize()*(stationRadiusB-stationStrokeWidthB/2);
        var offsetA2 = offset - difference.normalize()*(stationRadiusA-stationStrokeWidthA/2);
        var offsetB2 = offset + difference.normalize()*(stationRadiusB-stationStrokeWidthB/2);
        var line1 = new Path(this.stationA.position + offsetA1, this.stationB.position + offsetB1);
        var line2 = new Path(this.stationA.position - offsetA2, this.stationB.position - offsetB2);
        line1.strokeColor = this.stationA.style.strokeColor;
        line2.strokeColor = this.stationA.style.strokeColor;
        line1.strokeWidth = stationStrokeWidth;
        line2.strokeWidth = stationStrokeWidth;
        this.paths = [];
        this.paths.push(rectangle);
        this.paths.push(line1);
        this.paths.push(line2);
    },
};


function createConnection(stationA, stationB) {
    var observable = Object.create(util.Observable).Observable();
    var connection = Object.assign(observable, Connection);
    connection = connection.Connection(stationA, stationB);
    return connection;
}


module.exports = {
    createConnection: createConnection,
};