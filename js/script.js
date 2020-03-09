// select the img element
var line_graph = d3.select("#line-graph");
var bar_graph = d3.select("#bar-graph");

// parameters
var width = 1024;
var height = 550;
var padding = 25;
var step = (width - padding) / 20;

// set up the scales of the graphs
line_graph.attr("width", width);
line_graph.attr("height", height);

bar_graph.attr("width", width / 3);
bar_graph.attr("height", height);




var data = [];

// generate some random data for testing
for (var x = 0; x <= width - padding; x += step) {

  console.log(x);

  var y = (Math.random() - 0.5) * 150 + height / 2;
  data.push([padding + x, y]);

}



// draw grid
for (var x = padding; x < width; x += step) {

  var grid = [[x, 0], [x, height - padding]];

  var line = line_graph.append("path");
  line.attr("d", d3.line()(grid))
  line.attr("stroke", "grey")
  line.attr("stroke-width", 0.5)
  line.attr("fill", "none");

  var text = line_graph.append("text");
  text.attr("x", x - 10);
  text.attr("y", height);
  text.text(Math.floor(x));

}

for (var y = height - padding; y >= 0; y -= step) {

  var grid = [[padding, y], [width, y]];

  var line = line_graph.append("path");
  line.attr("d", d3.line()(grid))
  line.attr("stroke", "grey")
  line.attr("stroke-width", 0.5)
  line.attr("fill", "none");

}




// draw the line of the graph
var line = line_graph.append("path");
line.attr("d", d3.line()(data))
line.attr("stroke", "blue")
line.attr("stroke-width", 3)
line.attr("fill", "none");


// draw points
for (var i = 0; i < data.length; i += 1) {

  var circle = line_graph.append("circle");

  // set attributes
  circle.attr("cx", data[i][0]);
  circle.attr("cy", data[i][1]);
  circle.attr("r", 3);
  circle.attr("fill", "green");
}


/////////////////////////////////////////////////

// draw selection line
var line_data = [[padding, 0],[padding, height - padding + 10]];
var line = line_graph.append("path");
line.attr("d", d3.line()(line_data));
line.attr("stroke", "gray");
line.style("stroke-dasharray", ("5, 5"));
line.attr("stroke-width", 1);
line.attr("fill", "none");


// create circle
var circle = line_graph.append("circle");

// set attributes
circle.attr("id", "moving_dot")
circle.attr("cx", padding);
circle.attr("cy", data[0][1]);
circle.attr("r", 5);
circle.attr("fill", "red");

// add text label
var text = line_graph.append("text");
text.attr("font-size", "30px");
text.attr("x", padding - 25);
text.attr("y", data[0][1] - 20);
text.text(Math.floor(data[0][1]));


// handel movement over line graph
line_graph.on("mousemove", function () {
  var mouse = d3.mouse(d3.event.target);

  var idx = Math.floor((mouse[0] - padding) / step);
  var delta = (((mouse[0] - padding) / step) - idx) * (data[idx + 1][1] - data[idx][1])

  // update circle
  circle.attr("cx", mouse[0]);
  circle.attr("cy", data[idx][1] + delta);

  // update line
  var line_data = [[mouse[0], 0],[mouse[0], height - padding + 10]];
  line.attr("d", d3.line()(line_data));

  // update text
  text.attr("x", mouse[0] - 25);
  text.attr("y", data[idx][1] + delta - 20);
  text.text(Math.floor(data[idx][1] + delta));

});

