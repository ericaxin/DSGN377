
// get the data for line graphs
d3.csv("./data/lines.csv").then(function (data) {

  data = prepareData(data);

  var cost = new LineGraph('cost', [data[0]]);

  var range = cost.dataRange();
  range["min"]["y"] = 0;
  range["max"]["y"] = 80000;

  var labels = cost.makeLabels();
  labels.y = ["0", "20k", "40k", "60k", "80k"];

  cost.suffix = '$';

  var salary = new LineGraph('salary', [data[1]]);

  var range = salary.dataRange();
  range["min"]["y"] = 0;
  range["max"]["y"] = 4000000;

  var labels = salary.makeLabels();
  labels.y = ["0", "1 Mio.", "2 Mio.", "3 Mio.", "4 Mio."];
  
  salary.suffix = '$';


  var percentage_data = preparePercentageData(data);

  var percentage = new LineGraph('percentage', percentage_data);

  var range = percentage.dataRange();
  range["min"]["y"] = -50;
  range["max"]["y"] = 50;

  var labels = percentage.makeLabels();
  labels.y = ["-50%", "-25%", "0%", "25%", "50%"];

  percentage.suffix = '%';


  cost.add_to_update_list(salary);
  cost.add_to_update_list(percentage);

  salary.add_to_update_list(cost);
  salary.add_to_update_list(percentage);

  percentage.add_to_update_list(cost);
  percentage.add_to_update_list(salary);

  cost.setup()
  salary.setup()
  percentage.setup()


});


d3.csv("./data/circle.csv").then(function(data) {

  data = prepareData(data);

  //var circle_graph = CircleGraph(data)

});





/*

// select the img element
var line_graph = d3.select("#line-graph");
var circle_graph = d3.select("#circle-graph");

// parameters
var step = 45;
var padding = 25;
var width = 18 * step + 2 * padding;
var height = 10 * step + 2 * padding;



// set up the scales of the graphs
line_graph.attr("width", width);
line_graph.attr("height", height);

circle_graph.attr("width", width / 3);
circle_graph.attr("height", height);




var data = [];
var details = [];

// generate some random data for testing
for (var x = 0; x <= width - 2 * padding; x += step) {

  var y = (Math.random() - 0.5) * 150 + height / 2;
  data.push([padding + x, y]);

  var val1 = Math.random() * 50;
  var val2 = Math.random() * 50;
  var val3 = Math.random() * 50;

  details.push([val1, val2, val3]);

}

/////////////////////////////////////////////////
// Circle
/////////////////////////////////////////////////

var circle_list = [];
var color_list = ['red', 'green', 'blue'];

for (var i = 0; i < details[0].length; i += 1) {

  // create circle
  var circle = circle_graph.append("circle");
  circle.attr("cx", ((width / 3) / details[0].length) * (i + 0.5));
  circle.attr("cy", (height / details[0].length) * (i + 0.5) );
  circle.attr("r", details[0][i]);
  circle.attr("fill", color_list[i]);

  circle_list.push(circle);

}








/////////////////////////////////////////////////
// Line Graph Code
/////////////////////////////////////////////////

// draw grid
for (var x = padding; x <= width - padding; x += step) {

  var grid = [[x, padding], [x, height - padding]];

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

for (var y = height - padding; y >= padding; y -= step) {

  if (y !== height / 2) {
    var grid = [[padding, y], [width - padding, y]];
  } else {
    var grid = [[padding - 10, y], [width - padding + 10, y]];
  }

  var line = line_graph.append("path");
  line.attr("d", d3.line()(grid))
  if (y !== height / 2) {
    line.attr("stroke", "grey");
    line.attr("stroke-width", 0.5);
  } else {
    line.attr("stroke", "black");
    line.attr("stroke-width", 1);
  }
  line.attr("fill", "none");

}




// draw the line of the graph
var line = line_graph.append("path");
line.attr("d", d3.line()(data))
line.attr("stroke", "#ffb10a")
line.attr("stroke-width", 3)
line.attr("fill", "none");


// draw points
for (var i = 0; i < data.length; i += 1) {

  var circle = line_graph.append("circle");

  // set attributes
  circle.attr("cx", data[i][0]);
  circle.attr("cy", data[i][1]);
  circle.attr("r", 3);
  circle.attr("fill", "#f5840c");
}


/////////////////////////////////////////////////

// draw selection line
var line_data = [[padding, padding - 10], [padding, height - padding + 10]];
var line = line_graph.append("path");
line.attr("d", d3.line()(line_data));
line.attr("stroke", "gray");
line.style("stroke-dasharray", ("5, 5"));
line.attr("stroke-width", 1);
line.attr("fill", "none");


// create circle
var circle = line_graph.append("circle");
circle.attr("cx", padding);
circle.attr("cy", data[0][1]);
circle.attr("r", 5);
circle.attr("fill", "red");

// add text label
var text = line_graph.append("text");
text.attr("font-size", "30px");
text.attr("font-weight", "900");
text.attr("paint-order", "stroke");
text.attr("stroke-width", "10px");
text.attr("stroke", "white");
text.attr("fill", "#f5840c");
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
  var line_data = [[mouse[0], padding - 10], [mouse[0], height - padding + 10]];
  line.attr("d", d3.line()(line_data));

  // update text
  text.attr("x", mouse[0] - 25);
  text.attr("y", data[idx][1] + delta - 20);
  text.text(Math.floor(data[idx][1] + delta));

  // update circle graph
  for (var i = 0; i < details[0].length; i += 1) {

    var delta = (((mouse[0] - padding) / step) - idx) * (details[idx + 1][i] - details[idx][i])
    circle_list[i].attr("r", details[idx][i] + delta);

  }

});
*/
