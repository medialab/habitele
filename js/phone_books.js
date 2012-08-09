vizData = JSON.parse(localStorage["data"]);
initViz();

function initViz() {

  var obj = vizData.visualizations.phone_books;
  
  dataDisplay(obj);

}



function dataDisplay(data) {

  // data = dataPeak.aggregated_data;
  console.log(data)

  var names = ["contacts", "emails", "mobile_phones", "private_phones"];
  var values = [data.contacts, data.email, data.mobile_phone, data.private_phone];

  console.log(names)
  console.log(values)

  var aggregatedDataJSON = []; //declare array

  for (var i in names) {
      aggregatedDataJSON.push({name: names[i], value: values[i]});
  }

  console.log(aggregatedDataJSON)

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

};