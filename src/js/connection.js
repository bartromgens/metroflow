require("paper");
core = require("./core.js");
styles = require("./styles.js");


var Connection = {
    Connection: function(stationA, stationB) {
        this.stationA = stationA;
        this.stationB = stationB;
        return this;
    },
    draw: function() {
        var difference = this.stationB.position - this.stationA.position;
        var size = new Size(difference.length, this.stationA.style.stationRadius-this.stationA.style.strokeWidth/2);
        var offset = new Point(0, this.stationA.style.stationRadius/2-this.stationA.style.strokeWidth/4);
        var rectangle = new Path.Rectangle(this.stationA.position - offset, size);
        rectangle.fillColor = styles.rgbToHex(255, 255, 255);
        rectangle.strokeWidth = 0;
        rectangle.rotate(difference.angle, this.stationA.position);
        var offset = difference.normalize().rotate(90) * this.stationA.style.stationRadius/2;
        var offset1 = offset + difference.normalize()*(this.stationA.style.stationRadius-this.stationA.style.strokeWidth/2);
        var offset2 = offset - difference.normalize()*(this.stationA.style.stationRadius-this.stationA.style.strokeWidth/2);
        var line1 = new Path(this.stationA.position + offset1, this.stationB.position + offset2);
        var line2 = new Path(this.stationA.position - offset2, this.stationB.position - offset1);
        line1.strokeColor = this.stationA.style.strokeColor;
        line2.strokeColor = this.stationA.style.strokeColor;
        line1.strokeWidth = this.stationA.style.strokeWidth;
        line2.strokeWidth = this.stationA.style.strokeWidth;
    },
};


function createConnection(stationA, stationB) {
    var observable = Object.create(core.Observable).Observable();
    var connection = Object.assign(observable, Connection);
    connection = connection.Connection(stationA, stationB);
    return connection;
}



module.exports = {
    createConnection: createConnection,
};