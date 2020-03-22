
// Simple line graph class
class LineGraph {

    // id - the id of the svg container
    // data - 2d array containing the data points
    // first dimension number of lines
    // second dimension array of points
    constructor(id, data, func) {

        this.data = data;
        this.svg = d3.select("#" + id);

        // parameters
        this.padding = 75;
        this.step = 5;
        this.y_segments = 4;
        this.suffix = '';
        this.prefix = '';
        this.range = null;
        this.labels = null;
        this.image = null;
        this.unit = '';
        this.update_list = [];
        this.color = ['red', 'blue'];
        this.links = [
            'https://raw.githubusercontent.com/ericaxin/DSGN377/gh-pages/assets/SmallJudithRodin.png',
            'https://raw.githubusercontent.com/ericaxin/DSGN377/gh-pages/assets/SmallAmyG.png'
        ]

        this.faces = false;

        // move selection line 
        this.svg.on("mousemove", function () {

            var mouse = d3.mouse(d3.event.target);

            this.updateCursor(mouse[0]);

            for (var i = 0; i < this.update_list.length; i += 1) {
                this.update_list[i].updateCursor(mouse[0]);
            }

            var x = mouse[0];

            if (x < this.padding) {

                x = this.padding;

            } else if (x > this.padding + this.width_point) {

                x = this.padding + this.width_point;

            }

            // compute array index
            var tmp = ((x - this.padding) / this.width_point) * this.data[0].length;
            var idx = Math.floor(tmp);

            func(idx);


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

        this.cursor_xaxis = this.svg.append("text");
        this.cursor_xaxis.attr("fill", 'black');

        this.cursor_xaxis.text(Math.floor(this.data[0][0].x));
        var y = this.padding + this.height_point;
        var x = this.padding;

        var bbox = this.cursor_xaxis.node().getBBox();
        y = y + bbox.height * 1.25;
        x = x - bbox.width * 0.5;

        this.cursor_xaxis.attr("x", x);
        this.cursor_xaxis.attr("y", y);


        this.cursor_circle = [];
        this.cursor_text = [];

        for (var line = 0; line < this.data.length; line += 1) {

            var y = this.convertY(this.data[line][0].y)

            // create circle
            if (this.faces) {

                this.faces_width = 50;
                this.faces_height = 50;

                this.cursor_circle.push(this.svg.append("image"));
                this.cursor_circle[line].attr('xlink:href', this.links[0]);
                this.cursor_circle[line].attr('width', this.faces_width);
                this.cursor_circle[line].attr('width', this.faces_height);
                this.cursor_circle[line].attr('x', -100);


            } else {

                this.cursor_circle.push(this.svg.append("circle"));
                this.cursor_circle[line].attr("r", 5);
                this.cursor_circle[line].attr("fill", this.color[line]);
                this.cursor_circle[line].attr("cx", -5);
                this.cursor_circle[line].attr("cy", -5);

            }

            // add text label
            this.cursor_text.push(this.svg.append("text"));
            this.cursor_text[line].attr("font-size", "20px");
            this.cursor_text[line].attr("font-weight", "900");
            this.cursor_text[line].attr("paint-order", "stroke");
            this.cursor_text[line].attr("stroke-width", "5px");
            this.cursor_text[line].attr("stroke", "white");
            this.cursor_text[line].attr("fill", this.color[line]);


            if (y !== null) {

                if (this.faces) {

                    this.cursor_circle[line].attr("x", this.padding - this.faces_width / 2);
                    this.cursor_circle[line].attr("y", y - this.faces_height / 2);

                } else {

                    this.cursor_circle[line].attr("cx", this.padding);
                    this.cursor_circle[line].attr("cy", y);

                }

                this.cursor_text[line].attr("x", this.padding - 25);
                this.cursor_text[line].attr("y", y - 20);
                this.cursor_text[line].text(this.prefix + Math.floor(this.data[line][0].y) + this.suffix);


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

        // year
        this.cursor_xaxis.text(Math.floor(this.data[0][idx].x));
        var y_year = this.padding + this.height_point;
        var x_year = this.convertX(this.data[0][idx].x);

        var bbox = this.cursor_xaxis.node().getBBox();
        y_year = y_year + bbox.height * 1.25;
        x_year = x_year - bbox.width * 0.5;

        this.cursor_xaxis.attr("x", x_year);
        this.cursor_xaxis.attr("y", y_year);


        var delta = tmp - idx;

        if (delta === 0) {

            for (var line = 0; line < this.data.length; line += 1) {

                if (idx >= this.data[line].length) {
                    continue;
                }

                var y = this.convertY(this.data[line][idx].y);

                if (y !== null) {

                    if (this.faces) {

                        if (this.data[line][idx].x >= 2005) {

                            if (this.cursor_circle[line].attr('xlink:href') !== this.links[1]) {

                                this.cursor_circle[line].attr('xlink:href', this.links[1]);

                            }

                        } else {

                            if (this.cursor_circle[line].attr('xlink:href') !== this.links[0]) {

                                this.cursor_circle[line].attr('xlink:href', this.links[0]);
                            }

                        }


                        this.cursor_circle[line].attr("x", x - this.faces_width / 2);
                        this.cursor_circle[line].attr("y", y - this.faces_height / 2);

                    } else {

                        this.cursor_circle[line].attr("cx", x);
                        this.cursor_circle[line].attr("cy", y);

                    }


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

                    if (this.faces) {

                        if (this.data[line][idx].x >= 2005) {

                            if (this.cursor_circle[line].attr('xlink:href') !== this.links[1]) {

                                this.cursor_circle[line].attr('xlink:href', this.links[1]);

                            }

                        } else {

                            if (this.cursor_circle[line].attr('xlink:href') !== this.links[0]) {

                                this.cursor_circle[line].attr('xlink:href', this.links[0]);
                            }

                        }


                        this.cursor_circle[line].attr("x", x - this.faces_width / 2);
                        this.cursor_circle[line].attr("y", y - this.faces_height / 2);

                    } else {

                        this.cursor_circle[line].attr("cx", x);
                        this.cursor_circle[line].attr("cy", y);

                    }



                }

            }

        }

        // text
        for (var line = 0; line < this.data.length; line += 1) {

            var y = this.convertY(this.data[line][idx].y);
            var x = this.convertX(this.data[line][idx].x);

            this.cursor_text[line].attr("x", x - 25);
            this.cursor_text[line].attr("y", y - 20);
            this.cursor_text[line].text(this.prefix + Math.floor(this.data[line][idx].y) + this.suffix);


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

    drawText(x, y, label, type, color) {


        var text = this.svg.append("text");
        text.attr("fill", color);
        text.text(label);

        var bbox = text.node().getBBox();

        if (type === "below") {

            y = y + bbox.height * 1.25;
            x = x - bbox.width * 0.5;

        } else if (type === "left") {

            y = y + bbox.height * 0.5;
            x = x - bbox.width - 10;

        } else if (type === "above") {
            y = y - bbox.height * 1.25;
            x = x - bbox.width * 0.5;
        }

        text.attr("x", x);
        text.attr("y", y);


    }

    drawGrid() {

        var x_range = this.range.max.x - this.range.min.x + 1;

        var width = this.width - this.padding * 2;
        var height = this.height - this.padding * 2;

        var x_unit = Math.floor(width / x_range);
        var y_unit = Math.floor(height / this.y_segments);

        width = x_unit * x_range;
        height = y_unit * this.y_segments;


        this.width_point = width;
        this.height_point = height;


        for (var x = this.padding; x <= this.padding + width; x += x_unit * this.step) {

            var path = [[x, this.padding], [x, this.padding + height]];
            this.drawPath(path, "grey", 0.5);

            if (x !== this.padding) {

                var text_x = x;
                var text_y = this.padding + height;
                var text = (x - this.padding) / (x_unit * this.step);

                this.drawText(text_x, text_y, this.labels.x[text], "below", "grey");
            }

        }

        for (var y = this.padding; y <= this.padding + height; y += y_unit) {

            var path = [[this.padding, y], [this.padding + width, y]];
            this.drawPath(path, "grey", 0.5);

            var text_x = this.padding;
            var text_y = y;
            var text = (this.padding + height - y) / y_unit

            this.drawText(text_x, text_y, this.labels.y[text], "left", "grey");

        }

        this.y_unit = y_unit;
        this.x_unit = x_unit;

        this.drawText(this.padding + x_unit * 10,  this.padding * 1.4 + height, "YEARS", "below", "black")
        this.drawText(this.padding - 10,  this.padding , this.unit, "above", "black")
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