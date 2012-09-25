vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
  setCookie(document.cookie.split("=")[1]);
});



function initViz() {
  
  // Reset & scales
  
  $('[id^="graph_"]').html("");
  weekScale = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  dayScale = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24" ];

  // Computing max for y axis

  max1 = d3.max(vizData.visualizations.activity_timelines.calls_working_typical_day_by_24hour);
  max2 = d3.max(vizData.visualizations.activity_timelines.calls_weekend_typical_day_by_24hour);
  max3 = d3.max(vizData.visualizations.activity_timelines.calls_monday_to_sunday);
  max4 = d3.max(vizData.visualizations.activity_timelines.SMS_working_typical_day_by_24hour);
  max5 = d3.max(vizData.visualizations.activity_timelines.SMS_weekend_typical_day_by_24hour);
  max6 = d3.max(vizData.visualizations.activity_timelines.SMS_monday_to_sunday);

  // Display
  
  vizDisplay(d3.max([max1, max2]), "graph_1", "calls_working_typical_day_by_24hour", dayScale, '#d9aa59');
  vizDisplay(d3.max([max1, max2]), "graph_2", "calls_weekend_typical_day_by_24hour", dayScale, '#d9aa59');
  vizDisplay(max3, "graph_3", "calls_monday_to_sunday", weekScale, '#03717e');

  $('#graph_3 .x text').each(function(i) {
    if (i==0) $(this).attr('data-lang', 'monday');
    if (i==1) $(this).attr('data-lang', 'tuesday');
    if (i==2) $(this).attr('data-lang', 'wednesday');
    if (i==3) $(this).attr('data-lang', 'thursday');
    if (i==4) $(this).attr('data-lang', 'friday');
    if (i==5) $(this).attr('data-lang', 'saturday');
    if (i==6) $(this).attr('data-lang', 'sunday');
  });

  vizDisplay(d3.max([max4, max5]), "graph_4", "SMS_working_typical_day_by_24hour", dayScale, '#d9aa59');
  vizDisplay(d3.max([max4, max5]), "graph_5", "SMS_weekend_typical_day_by_24hour", dayScale, '#d9aa59');
  vizDisplay(max6, "graph_6", "SMS_monday_to_sunday", weekScale, '#03717e');

  $('#graph_6 .x text').each(function(i) {
    if (i==0) $(this).attr('data-lang', 'monday');
    if (i==1) $(this).attr('data-lang', 'tuesday');
    if (i==2) $(this).attr('data-lang', 'wednesday');
    if (i==3) $(this).attr('data-lang', 'thursday');
    if (i==4) $(this).attr('data-lang', 'friday');
    if (i==5) $(this).attr('data-lang', 'saturday');
    if (i==6) $(this).attr('data-lang', 'sunday');
  });

  // Behaviours

  $('.dot').each(function() {
    $(this).attr({
      'rel': 'tooltip',
      'title': $(this).attr('value')
    });
  });

  $("[rel=tooltip]").tooltip();

  setCookie(document.cookie.split("=")[1]);

  
}



function vizDisplay(vizMax, vizCollapse, dataStructure, vizScale, color) {

  var actTimData = vizData.visualizations.activity_timelines[dataStructure];

  var data = d3.range(vizScale.length).map(function(i) {
    return {x: i, y: actTimData[i]};
  });

  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = $(".span10").width() - margin.left - margin.right,
      height = 140 - margin.top - margin.bottom;

  var x = d3.scale.linear().domain([0, vizScale.length-1]).range([0, width]);
  var y = d3.scale.linear().domain([0, vizMax]).range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(vizScale.length)
    .tickFormat(function(d) { return vizScale[d]; });

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(4);

  var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  var area = d3.svg.area()
      .x(line.x())
      .y1(line.y())
      .y0(y(0));


  // Svg

  var svg = d3.select("#" + vizCollapse).append("svg")
      .datum(data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Areas and lines

  svg.append("path")
      .attr("class", "area")
      .attr("d", area)
      .style('fill', color)
      .style('opacity', '.4');

  svg.append("path")
      .attr("class", "line")
      .attr("d", line)
      .style('fill', 'none')
      .style('stroke', color)
      .style('stroke-width', '1.5px');
  
  // Axes

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Dot

  svg.selectAll(".dot")
      .data(data.filter(function(d) { return d.y; }))
    .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3)
      .attr("value", function(d) { return d.y; })
      .style('fill', 'white')
      .style('stroke', color)
      .style('stroke-width', '1.5px');
};

