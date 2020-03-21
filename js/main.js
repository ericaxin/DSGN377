
var registered = []
var update = function(x) {
  for (var idx = 0; idx < registered.length; idx += 1) {
    registered[idx].update(x);
  }
}

// get the data for line graphs
d3.csv("https://ericaxin.github.io/DSGN377/data/lines.csv").then(function (data) {

  data = prepareData(data);

  var cost = new LineGraph('cost', [data[0]], update);

  cost.color = ['#004785']

  var range = cost.dataRange();
  range["min"]["y"] = 0;
  range["max"]["y"] = 80000;

  var labels = cost.makeLabels();
  labels.y = ["0", "20k", "40k", "60k", "80k"];

  cost.prefix = '$';

  var salary = new LineGraph('salary', [data[1]], update);

  salary.faces = true;
  salary.color = ['#a90533']

  var range = salary.dataRange();
  range["min"]["y"] = 0;
  range["max"]["y"] = 4000000;

  var labels = salary.makeLabels();
  labels.y = ["0", "1M", "2M", "3M", "4M"];
  
  salary.prefix = '$';


  var percentage_data = preparePercentageData(data);

  var percentage = new LineGraph('percentage', percentage_data, update);

  percentage.color = ['#004785', '#a90533']

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


d3.csv("https://ericaxin.github.io/DSGN377/data/circle.csv").then(function(data) {

  data = prepareData(data);
  var circle_graph = new CircleGraph('circle', data);
  circle_graph.setup();

  registered.push(circle_graph);

});