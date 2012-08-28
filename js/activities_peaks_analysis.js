vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
$("ul.nav-tabs").html("");
$("div.tab-content").html("");
initViz();
});

function initViz() {

var obj = vizData.visualizations.activities_peaks_analysis.peaks_timeline;

for(var i in obj) {
  if(obj.hasOwnProperty(i)) {
    dataDisplay(i.substr(5));
  }
}
}

var dataPeak;

function dataDisplay(peak) {

peak = peak.toString();

liItems = d3.select("ul.nav-tabs").append("li");

if (peak == 1) liItems.attr("class", "active");

liItems.append("a")
  .attr("href", "#tab" + peak)
  .attr("data-toggle", "tab")
  .text("Peak " + peak);

divItem = d3.select(".tab-content").append("div")
  .attr("id", "tab" + peak)
  .text("Tab" + peak);

tempValue = ( peak == 1 ) ? "row tab-pane active" : "row tab-pane";
divItem.attr("class", tempValue);

divItem.append("div").attr("class", "span12 timeline");
divItem.append("div").attr("class", "span4 contacts");
divItem.append("div").attr("class", "span4 directions");
divItem.append("div").attr("class", "span4 distribution");

dataPeak = vizData.visualizations.activities_peaks_analysis.peaks_timeline['peak_' + peak];

dataPeakCount = 0;
for (key in dataPeak.events) dataPeakCount++;

// 
// Timeline
//

var format = d3.time.format("%Y-%m-%d %H:%M:%S");

var data = d3.range(dataPeakCount).map(function(d) {
  console.log(dataPeak.events[d+1].time.substr(0, 19))
  console.log(format.parse(dataPeak.events[d+1].time.substr(0, 19)))

  return {x: format.parse(dataPeak.events[d+1].time.substr(0, 19)), y: 1};
});

var margin = {top: 10, right: 20, bottom: 20, left: 20},
    width = $("#tab" + peak + " .timeline").width() - margin.left - margin.right,
    height = 60 - margin.top - margin.bottom;

// var x = d3.time.scale()
//   .domain([format.parse(dataPeak.start.substr(0, 19)), format.parse(dataPeak.stop.substr(0, 19))])
//   .range([0, width]);

var x = d3.time.scale()
  .domain([d3.min(data, function(d) { return d.x; }), d3.max(data, function(d) { return d.x; })])
  .range([0, width]);

var y = d3.scale.linear().domain([0, 1]).range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line().x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); });

var svg = d3.select("#tab" + peak + " .timeline").append("svg")
    .datum(data)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("path")
    .attr("class", "line")
    .attr("d", line);

svg.selectAll(".dot")
    .data(data.filter(function(d) { return d.y; }))
  .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", line.x())
    .attr("cy", line.y())
    .attr("r", 1);

// 
// Contacts
// 

var contacts = [];
for (key in dataPeak.events) contacts.push(dataPeak.events[key].contact);
contacts = eliminateDuplicates(contacts);

tbody = d3.select("#tab" + peak + " .contacts").append("table")
  .attr("class", "table table-condensed table-bordered table-striped")
  .append("tbody");

for (var i in contacts) {
  if (contacts.hasOwnProperty(i)) tbody.append("tr").append("td").text(contacts[i]);
}

// 
// Directions
//

data = dataPeak.aggregated_data;

var directionsNames = ["total_callandsms_in", "total_callandsms_out", "total_SMS", "total_call"];
var directionsValues = [data.total_callandsms_in, data.total_callandsms_out, data.total_SMS, data.total_call];

var aggregatedDataJSON = [];
for (var i in directionsNames) aggregatedDataJSON.push({name: directionsNames[i], value: directionsValues[i]});

// 

var margin = {top: 30, right: 10, bottom: 10, left: 100},
  width = $("div#tab" + peak + " .directions").width() - margin.right - margin.left,
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

var svg = d3.select("div#tab" + peak + " .directions").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse numbers, and sort by value.
// aggregatedDataJSON.forEach(function(d) { d.value = +d.value; });
// aggregatedDataJSON.sort(function(a, b) { return b.value - a.value; });

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