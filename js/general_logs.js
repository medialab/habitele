vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});



function initViz() {

  // $("div#container").html("");
  $('[id^="loggraph_"]').html("");

  dataDisplay(vizData.visualizations.general_logs);

}



function dataDisplay(data) {

  // List data

  items = d3.select("div#loggraph_1")
    .append("table")
    .attr("class", "table table-condensed table-bordered table-striped")
    .append("tbody")

  tr = items.append("tr");
  tr.append("td").text("total_phone_book_entries");
  tr.append("td").text(data.total_phone_book_entries);

  tr = items.append("tr");
  tr.append("td").text("communication_smsandcall_density");
  tr.append("td").text(data.communication_smsandcall_density);
    
  // Bar Chart 0

  var names, values, aggregatedDataJSON = [];
  names = ["total", "in", "out"];
  values = [data.calls.total, data.calls.in, data.calls.out];
  for (i in names) aggregatedDataJSON.push({name: names[i], value: values[i]});
  displayTable(aggregatedDataJSON, "loggraph_3");

  // Bar Chart 1

  var names, values, aggregatedDataJSON = [];
  names = ["duration_total", "duration_in", "duration_out"];
  values = [data.calls.duration_total, data.calls.duration_in, data.calls.duration_out];
  for (i in names) aggregatedDataJSON.push({name: names[i], value: values[i]});
  displayTable(aggregatedDataJSON, "loggraph_2");

  // Bar Chart 2

  var names, values, aggregatedDataJSON = [];
  names = ["total", "in", "out"];
  values = [data.SMS.total, data.SMS.in, data.SMS.out];
  for (i in names) aggregatedDataJSON.push({name: names[i], value: values[i]});
  displayTable(aggregatedDataJSON, "loggraph_4");

  // Bar Chart 3

  var names, values, aggregatedDataJSON = [];
  names = ["total", "in", "out"];
  values = [data.MMS.total, data.MMS.in, data.MMS.out];
  for (i in names) aggregatedDataJSON.push({name: names[i], value: values[i]});
  displayTable(aggregatedDataJSON, "loggraph_5");

};

function displayTable(aggregatedDataJSON, vizGraph) {

  var margin = {top: 10, right: 10, bottom: 10, left: 100},
    width = $("div#container").width() - margin.right - margin.left,
    height = 120 - margin.top - margin.bottom;

  var format = d3.format(",.0f");

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .1);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(0);

  var svg = d3.select("div#" + vizGraph).append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse numbers, and sort by value.
  // aggregatedDataJSON.forEach(function(d) { d.value = +d.value; });
  // aggregatedDataJSON.sort(function(a, b) { return b.value - a.value; });

  // Set the scale domain.
  x.domain([0, d3.max(aggregatedDataJSON, function(d) { return d.value; })]);
  y.domain(aggregatedDataJSON.map(function(d) { return d.name; }));

  var bar = svg.selectAll("g.bar")
      .data(aggregatedDataJSON)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", y.rangeBand());

  bar.append("text")
      .attr("class", "value")
      .attr("x", function(d) { return x(d.value); })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return format(d.value); });

  svg.append("g")
      .attr("class", "x axis bar")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis bar")
      .call(yAxis);

}