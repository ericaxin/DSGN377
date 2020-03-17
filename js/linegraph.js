
// Simple line graph class
class LineGraph {

    // id - the id of the svg container
    // data - 2d array containing the data points
    // first dimension number of lines
    // second dimension array of points
    constructor(id, data) {

        this.data = data;
        this.svg = d3.select("#" + id);

        // parameters
        this.padding = 75;
        this.step = 5;
        this.y_segments = 4;
        this.suffix = '';
        this.range = null;
        this.labels = null;
        this.image = null;
        this.update_list = [];
        this.color=['red', 'blue'];

        // move selection line 
        this.svg.on("mousemove", function () {

            var mouse = d3.mouse(d3.event.target);

            this.updateCursor(mouse[0]);

            for (var i = 0; i < this.update_list.length; i += 1) {
                this.update_list[i].updateCursor(mouse[0]);
            }

        }.bind(this));

    }

    setup() {

        this.svg.selectAll().remove();
        this.computeDimensions();
        this.dataRange();
        this.makeLabels();
        this.drawGrid();
        this.drawLine();
        this.drawCursor();

    }

    add_to_update_list(item) {

        this.update_list.push(item);

    }


    drawCursor() {

        // draw selection line
        var line_data = [
            [this.padding, this.padding - 8],
            [this.padding, this.height_point + this.padding + 8]
        ];

        this.cursor_line = this.svg.append("path");
        this.cursor_line.attr("d", d3.line()(line_data));
        this.cursor_line.attr("stroke", "gray");
        this.cursor_line.style("stroke-dasharray", ("3, 5"));
        this.cursor_line.attr("stroke-width", 1);
        this.cursor_line.attr("fill", "none");


        this.cursor_circle = [];
        this.cursor_text = [];

        for (var line = 0; line < this.data.length; line += 1) {

            var y = this.convertY(this.data[line][0].y)


            // create circle
            this.cursor_circle.push(this.svg.append("circle"));
            this.cursor_circle[line].attr("r", 5);
            this.cursor_circle[line].attr("fill", this.color[line]);

            // add text label
            this.cursor_text.push(this.svg.append("text"));
            this.cursor_text[line].attr("font-size", "20px");
            this.cursor_text[line].attr("font-weight", "900");
            this.cursor_text[line].attr("paint-order", "stroke");
            this.cursor_text[line].attr("stroke-width", "5px");
            this.cursor_text[line].attr("stroke", "white");
            this.cursor_text[line].attr("fill", this.color[line]);


            if (y !== null) {

                this.cursor_circle[line].attr("cx", this.padding);
                this.cursor_circle[line].attr("cy", y);
               
                this.cursor_text[line].attr("x", this.padding - 25);
                this.cursor_text[line].attr("y", y - 20);
                this.cursor_text[line].text(Math.floor(this.data[line][0].y) + this.suffix);

            }

        }

    }


    updateCursor(x) {

        if (x < this.padding) {
            x = this.padding;
        } else if (x > this.padding + this.width_point) {
            x = this.padding + this.width_point;
        }

        // update line
        var line_data = [
            [x, this.padding - 8],
            [x, this.height_point + this.padding + 8]
        ];

        this.cursor_line.attr("d", d3.line()(line_data));


        // compute array index
        var tmp = ((x - this.padding) / this.width_point) * this.data[0].length;
        var idx = Math.floor(tmp);

        var delta = tmp - idx;

        if (delta === 0) {

            for (var line = 0; line < this.data.length; line += 1) {

                if (idx >= this.data[line].length) {
                    continue;
                }

                var y = this.convertY(this.data[line][idx].y);
    
                if (y !== null) {
    
                    this.cursor_circle[line].attr("cx", x);
                    this.cursor_circle[line].attr("cy", y);
    
                    this.cursor_text[line].attr("x", x - 25);
                    this.cursor_text[line].attr("y", y - 20);
                    this.cursor_text[line].text(Math.floor(this.data[line][idx].y) + this.suffix);
    
                }
    
            }


        } else {

            for (var line = 0; line < this.data.length; line += 1) {

                if (1 + idx >= this.data[line].length) {
                    continue;
                }

                var y0 = this.convertY(this.data[line][idx].y);
                var y1 = this.convertY(this.data[line][idx + 1].y);
    
                if (y0 !== null && y1 !== null) {

                    var y = y0 + (y1 - y0) * delta;

                    var value = this.data[line][idx].y + (this.data[line][idx + 1].y - this.data[line][idx].y) * delta;
    
                    this.cursor_circle[line].attr("cx", x);
                    this.cursor_circle[line].attr("cy", y);
    
                    this.cursor_text[line].attr("x", x - 25);
                    this.cursor_text[line].attr("y", y - 20);
                    this.cursor_text[line].text(Math.floor(value) + this.suffix);
    
                }
    
            }

        }
        




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


    // used to manually set the labels
    makeLabels() {

        if (this.labels === null) {

            var labels = {
                'x': [],
                'y': []
            };

            for (var x = this.range.min.x; x <= this.range.max.x + 1; x += this.step) {
                labels.x.push(x)
            }

            var y_step = (this.range.max.y - this.range.min.y) / this.y_segments;

            for (var y = this.range.min.y; y <= this.range.max.y; y += y_step) {
                labels.y.push(y)
            }

            this.labels = labels;

        }


        return this.labels;
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


    drawPath(path, color, width) {

        var line = this.svg.append("path");
        line.attr("d", d3.line()(path));
        line.attr("stroke", color);
        line.attr("stroke-width", width);
        line.attr("fill", "none");

    }

    drawText(x, y, label, type) {


        var text = this.svg.append("text");
        text.text(label);

        var bbox = text.node().getBBox();

        if (type === "below") {

            y = y + bbox.height * 1.25;
            x = x - bbox.width * 0.5;

        } else if (type === "left") {

            y = y + bbox.height * 0.5;
            x = x - bbox.width - 10;

        }

        text.attr("x", x);
        text.attr("y", y);


    }

    drawGrid() {

        var x_range = this.range.max.x - this.range.min.x + 1;

        var width = this.width - this.padding * 2;
        var height = this.height - this.padding * 2;

        this.width_point = width;
        this.height_point = height;

        var x_unit = Math.floor(width / x_range);
        var y_unit = Math.floor(height / this.y_segments);

        width = x_unit * x_range;
        height = y_unit * this.y_segments;


        for (var x = this.padding; x <= this.padding + width; x += x_unit * this.step) {

            var path = [[x, this.padding], [x, this.padding + height]];
            this.drawPath(path, "grey", 0.5);

            if (x !== this.padding) {

                var text_x = x;
                var text_y = this.padding + height;
                var text = (x - this.padding) / (x_unit * this.step);

                this.drawText(text_x, text_y, this.labels.x[text], "below");
            }

        }

        for (var y = this.padding; y <= this.padding + height; y += y_unit) {

            var path = [[this.padding, y], [this.padding + width, y]];
            this.drawPath(path, "grey", 0.5);

            var text_x = this.padding;
            var text_y = y;
            var text = (this.padding + height - y) / y_unit

            this.drawText(text_x, text_y, this.labels.y[text], "left");

        }


    }

    convertX(x) {

        if (x !== null) {
            var x_range = this.range.max.x - this.range.min.x + 1;
            var tmp = ((x - this.range.min.x) / x_range);
            return this.padding + tmp * this.width_point;
        }

        return null;

    }

    convertY(y) {

        if (y !== null) {
            var y_range = this.range.max.y - this.range.min.y;
            var tmp = ((y - this.range.min.y) / y_range)
            return this.padding + (1 - tmp) * this.height_point
        }

        return null;

    }

    drawLine() {

        for (var line = 0; line < this.data.length; line += 1) {

            for (var point = 1; point < this.data[line].length; point += 1) {

                var last = this.data[line][point - 1];
                var current = this.data[line][point];

                if (last.y !== null && current.y !== null) {

                    var x0 = this.convertX(last.x);
                    var x1 = this.convertX(current.x);
                    var y0 = this.convertY(last.y);
                    var y1 = this.convertY(current.y);

                    var path = [[x0, y0], [x1, y1]];

                    this.drawPath(path, this.color[line], 3);


                }

            }

        }

    }

};