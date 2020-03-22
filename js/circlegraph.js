

class CircleGraph {


    constructor(id, data) {

        this.data = data;
        this.svg = d3.select("#" + id);

        // parameters
        this.size = 0.5
        this.color = [
            '#aacedc',
            '#bfd4c5',
            '#b0b4d7',
            '#e8dbbb'
        ];

    }

    setup() {
        this.computeDimensions();
        this.computeLocations();
        this.dataRange();
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

    computeLocations() {

        this.cell_size = 129.5;

        this.center = [
            [150,100],
            [248,150],
            [227,42],
            [280,80]
        ];

        /*
        this.center = [
            [this.cell_width - this.cell_size / 2, this.cell_height - this.cell_size / 2],
            [this.cell_width + this.cell_size / 2, this.cell_height - this.cell_size / 2],
            [this.cell_width - this.cell_size / 2, this.cell_height + this.cell_size / 2],
            [this.cell_width + this.cell_size / 2, this.cell_height + this.cell_size / 2],
        ]
        */

    }

    drawCircles() {

        this.circles = [];

        for (var idx = 0; idx < this.center.length; idx += 1) {

            this.circles.push(this.svg.append("circle"));
            this.circles[idx].attr("fill", this.color[idx]);

        }

        this.update(0);
       

    }

    update(point) {


        for (var idx = 0; idx < this.circles.length; idx += 1) {

            var radius = Math.sqrt(this.data[idx][point].y / this.range.max.y) * this.cell_size / 2;

            var x = this.center[idx][0];
            var y = this.center[idx][1];

            this.circles[idx].attr("r", radius);
            this.circles[idx].attr("cx", x);
            this.circles[idx].attr("cy", y);
            

        }


    }

        // Extract the data range
        dataRange() {

            if (this.range == null) {
    
                // range object
                var range = {
                    'max': {
                        'x': null,
                        'y': null
                    },
                    'min': {
                        'x': null,
                        'y': null
                    }
                }
    
                // iterate over all points
                for (var line = 0; line < this.data.length; line += 1) {
                    for (var point = 0; point < this.data[line].length; point += 1) {
    
                        var coord = this.data[line][point];
    
                        if (coord.x !== null) {
    
                            if (range['max']['x'] === null
                                || range['max']['x'] < coord.x) {
    
                                range['max']['x'] = coord.x
                            }
    
                            if (range['min']['x'] === null
                                || range['min']['x'] > coord.x) {
    
                                range['min']['x'] = coord.x
                            }
    
                        }
    
                        if (coord.y !== null) {
    
                            if (range['max']['y'] === null
                                || range['max']['y'] < coord.y) {
    
                                range['max']['y'] = coord.y
                            }
    
                            if (range['min']['y'] === null
                                || range['min']['y'] > coord.y) {
    
                                range['min']['y'] = coord.y
                            }
    
                        }
    
                    }
                }
    
                this.range = range;
    
            }
    
            return this.range;
    
        }

    drawLegend() {

        var labels = [
            "Dorm & Meal Plan",
            "General Fee",
            "Tuition",
            "Technology Fee"
        ];

        var color = [
            '#b0b4d7',
            '#aacedc',
            '#bfd4c5',
            '#e8dbbb'
        ];

        var x_space = 75;

        for (var idx = 0; idx < this.color.length; idx += 1) {

            var dot = this.svg.append("circle");
            dot.attr("fill", color[idx]);

            dot.attr("r", 7);
            dot.attr("cx", x_space);
            dot.attr("cy", this.height - 25 * idx  - 10);

            var text = this.svg.append("text");

            text.attr("x", x_space + 20)
            text.attr("y", this.height - 25 * idx - 5);
            text.text(labels[idx]);


        }


        /*
        var r = Math.sqrt(10000 / this.range.max.y) * this.cell_size / 2;

        var dot = this.svg.append("circle");
        dot.attr("stroke", "grey");
        dot.attr("fill", "white");

        dot.attr("r", r);
        dot.attr("cx", 310);
        dot.attr("cy", this.height - 50);


        var path = this.svg.append("path");

        var line = [
            [310 + r, this.height - 50 ],
            [350, this.height - 50 ]
        ];

        path.attr("d", d3.line()(line));
        path.attr("stroke", "gray");
        path.attr("stroke-width", 1);
        path.attr("fill", "none");


        r = Math.sqrt(1000 / this.range.max.y) * this.cell_size / 2;

        dot = this.svg.append("circle");
        dot.attr("stroke", "grey");
        dot.attr("fill", "white");

        dot.attr("r", r);
        dot.attr("cx", 310);
        dot.attr("cy", this.height - 35);
        */

        


    }


}