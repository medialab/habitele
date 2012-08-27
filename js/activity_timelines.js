vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});


function initViz() {
  
  // Reset
  
  $("#collapseOne .accordion-inner").html("");
  $("#collapseTwo .accordion-inner").html("");
  $("#collapseThree .accordion-inner").html("");
  $("#collapseFour .accordion-inner").html("");
  $("#collapseFive .accordion-inner").html("");
  $("#collapseSix .accordion-inner").html("");

  // Computing max for y axis

  max1 = d3.max(vizData.visualizations.activity_timelines.SMS_working_typical_day_by_24hour);
  max2 = d3.max(vizData.visualizations.activity_timelines.calls_working_typical_day_by_24hour);
  max3 = d3.max(vizData.visualizations.activity_timelines.SMS_weekend_typical_day_by_24hour);
  max4 = d3.max(vizData.visualizations.activity_timelines.calls_weekend_typical_day_by_24hour);
  max5 = d3.max(vizData.visualizations.activity_timelines.SMS_monday_to_sunday);
  max6 = d3.max(vizData.visualizations.activity_timelines.calls_monday_to_sunday);

  maxForHour = d3.max([max1, max2, max3, max4]);
  maxForDay = d3.max([max5, max6]);

  // Display
  
  vizDisplay(24, maxForHour, "collapseOne", "SMS_working_typical_day_by_24hour");
  vizDisplay(24, maxForHour, "collapseTwo", "calls_working_typical_day_by_24hour");
  vizDisplay(24, maxForHour, "collapseThree", "SMS_weekend_typical_day_by_24hour");
  vizDisplay(24, maxForHour, "collapseFour", "calls_weekend_typical_day_by_24hour");
  vizDisplay(7, maxForDay, "collapseFive", "SMS_monday_to_sunday");
  vizDisplay(7, maxForDay, "collapseSix", "calls_monday_to_sunday");
}




function vizDisplay(vizRange, vizMax, vizCollapse, dataStructure) {

  var actTimData = vizData.visualizations.activity_timelines[dataStructure];

  var data = d3.range(vizRange).map(function(i) {
    return {x: i, y: actTimData[i]};
  });

  var margin = {top: 10, right: 10, bottom: 20, left: 40},
      width = $("#collapseOne .accordion-inner").width() - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear().domain([0, vizRange-1]).range([0, width]);
  var y = d3.scale.linear().domain([0, vizMax]).range([height, 0]);

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


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


  svg.append("path")
      .attr("class", "area")
      .attr("d", area);

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

