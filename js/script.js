// select the svg element
var svg = d3.select("svg")

// load the data from the data folder
d3.csv("/data/cities.csv").then(function(data) {
    console.log(data[0]);
});
  