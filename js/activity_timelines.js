vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});


function initViz() {
  $("#collapseOne .accordion-inner").html("");
  $("#collapseTwo .accordion-inner").html("");
  $("#collapseThree .accordion-inner").html("");
  $("#collapseFour .accordion-inner").html("");
  $("#collapseFive .accordion-inner").html("");
  $("#collapseSix .accordion-inner").html("");
  vizDisplay(24, "collapseOne");
  vizDisplay(24, "collapseTwo");
  vizDisplay(24, "collapseThree");
  vizDisplay(24, "collapseFour");
  vizDisplay(7, "collapseFive");
  vizDisplay(7, "collapseSix");
}




function vizDisplay(vizRange, vizCollapse) {

  var actTimData = vizData.visualizations.activity_timelines.SMS_working_typical_day_by_24hour;

  var data = d3.range(vizRange).map(function(i) {
    return {x: i, y: actTimData[i]};
  });

  var margin = {top: 10, right: 10, bottom: 20, left: 40},
      width = $("#collapseOne .accordion-inner").width() - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear().domain([0, vizRange-1]).range([0, width]);
  var y = d3.scale.linear().domain([0, 20]).range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  var area = d3.svg.area()
      .x(line.x())
      .y1(line.y())
      .y0(y(0));

  var svg = d3.select("#" + vizCollapse + " div.accordion-inner").append("svg")
      .datum(data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("path")
      .attr("class", "area")
      .attr("d", area);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("path")
      .attr("class", "line")
      .attr("d", line);

  svg.selectAll(".dot")
      .data(data.filter(function(d) { return d.y; }))
    .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3);
};

