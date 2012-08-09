vizData = JSON.parse(localStorage["data"]);
initViz();

function initViz() {

  var obj = vizData.visualizations.general_logs;
  
  dataDisplay(obj);

}



function dataDisplay(data) {

  items = d3.select("div#container")
    .append("table")
    .attr("class", "table table-condensed table-bordered table-striped")
    .append("tbody")

  tr = items.append("tr");
  tr.append("td").text("total_phone_book_entries");
  tr.append("td").text(data.total_phone_book_entries);

  tr = items.append("tr");
  tr.append("td").text("communication_smsandcall_density");
  tr.append("td").text(data.communication_smsandcall_density);
    
  



  // "total_phone_book_entries": 724,
  // "communication_smsandcall_density": 6,

  // Bar Chart 1

  var names, values, aggregatedDataJSON = [];
  
  names = ["total", "in", "out", "duration_total", "duration_in", "duration_out", "density"];
  values = [data.calls.total, data.calls.in, data.calls.out, data.calls.duration_total, data.calls.duration_in, data.calls.duration_out, data.calls.density];

  for (i in names) {
      aggregatedDataJSON.push({name: names[i], value: values[i]});
  }

  displayTable(aggregatedDataJSON);

  // Bar Chart 2

  var names, values, aggregatedDataJSON = [];
  
  names = ["total", "in", "out", "density"];
  values = [data.SMS.total, data.SMS.in, data.SMS.out, data.SMS.density];

  for (i in names) {
      aggregatedDataJSON.push({name: names[i], value: values[i]});
  }

  displayTable(aggregatedDataJSON);

  // Bar Chart 3

  var names, values, aggregatedDataJSON = [];
  
  names = ["total", "in", "out", "density"];
  values = [data.MMS.total, data.MMS.in, data.MMS.out, data.MMS.density];

  for (i in names) {
      aggregatedDataJSON.push({name: names[i], value: values[i]});
  }

  displayTable(aggregatedDataJSON);

};

function displayTable(aggregatedDataJSON) {

  var margin = {top: 30, right: 10, bottom: 10, left: 100},
    width = 900 - margin.right - margin.left,
    height = 300 - margin.top - margin.bottom;

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

  var svg = d3.select("div#container").append("svg")
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
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

}