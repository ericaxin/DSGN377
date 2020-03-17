

class CircleGraph {


    constructor(id, data) {

        this.data = data;
        this.svg = d3.select("#" + id);

        // parameters
        this.size = 0.5
        this.color = [];

    }

    setup() {
        this.computeDimensions();
        this.drawCircles();
        this.drawLegend();
    }

    // sets the correct dimensions for the svg container
    computeDimensions() {

        var width = this.svg.style("width");
        var height = this.svg.style("height");

        width = width.slice(0, width.length - 2);
        height = height.slice(0, height.length - 2);

        this.width = parseInt(width);
        this.height = parseInt(height);

        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);

    }

    drawCircles() {


    }

    drawLegend() {

    }

    updateCircles(x) {

    }


}