vizData = JSON.parse(localStorage["data"]);
initViz();
setLang();



$(window).resize(function() {
  initViz();
  setLang();
});



function initViz() {

  var obj = vizData.visualizations.phone_books;
  dataDisplay(obj);

}



function dataDisplay(data) {

  names = [];
  values = [];
  json = [];
  jsonTemp = [];

  for (var i in data) {
      names.push(i);
      values.push(data[i]);
  }

  for (var i in names) {
      jsonTemp.push({name: names[i], value: values[i]});
  }

  jsonTemp.sort(function(a,b) { return parseFloat(b.value) - parseFloat(a.value) } );

  json.push({
    name: '',
    value: vizData.visualizations.phone_books_data.avg_number_of_fileds_used
  });

  json = json.concat(jsonTemp);

  var margin = {top: 0, right: 10, bottom: 10, left: 250},
    width = $("div#container").width() - margin.right - margin.left,
    height = 600 - margin.top - margin.bottom;

  var format = d3.format(",.0f");

  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(0);

  var svg = d3.select("div#container").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([-5, d3.max(json, function(d) { return d.value; })]);
  y.domain(json.map(function(d) { return d.name; }));

  var bar = svg.selectAll("g.bar")
      .data(json)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.value); })
      .attr("height", y.rangeBand())
      .attr("fill", '#03717e');

  bar.append("text")
      .attr("class", "value")
      .attr("x", function(d) { return x(d.value); })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return format(d.value); });

  svg.append("g")
      .attr("class", "y axis bar")
      .call(yAxis);

  $('.bar').first().attr('transform', 'translate(0,0)');
  $('.y.axis.bar').children().first().attr('transform', 'translate(0,14.5)');
  $('.y.axis.bar').children().first().children().last().attr('data-lang', 'average_number_of_fields_used')

};