var dataPeak;

initViz = function () {
  var obj = vizData.visualizations.activities_peaks_analysis.peaks_timeline;

  for(var i in obj) {
    if(obj.hasOwnProperty(i)) {
      dataDisplay(i.substr(5));
    }
  }

  setBehaviors();
}

activate_event = function(peak_number, event_number) {
    $("#svg" + peak_number + " circle").css("stroke", "steelblue")
    $("#peak" + peak_number + "_circle" + event_number).css("stroke", "red")
    $("#events" + peak_number).data("cur", event_number);
    $("#events" + peak_number + " tr").css("font-weight", "normal");
    $("#peak" + peak_number + "_event" + event_number).css("font-weight", "bold");
}

next = function(peak_number, event_length) {
    cur = $("#events" + peak_number).data("cur");
    if (cur+1 <= event_length) {
      $("#events" + peak_number).data("cur", cur + 1);
      activate_event(peak_number, cur + 1);
    }
}

prev = function(peak_number) {
    cur = $("#events" + peak_number).data("cur");
    if (cur-1 >= 0) {
      $("#events" + peak_number).data("cur", cur - 1);
      activate_event(peak_number, cur - 1);
    }
}


human_readable_duration = function(duration) {
  seconds = duration % 60;  
  minutes = (duration - seconds) /60  %60;
  hours = (duration - minutes * 60 - seconds) / 3600; 

  str_seconds = seconds ? seconds + " seconds" : "";
  str_minutes = minutes ? minutes + " minutes" : "";
  str_hours = hours ? hours + " hours" : "";

  return str_hours + " " + str_minutes + " " + str_seconds; 
}

dataDisplay = function (peak) {

  peak = peak.toString();

  // creating the tabs

  liItems = d3.select("ul.nav-tabs").append("li");

  if (peak == 1) liItems.attr("class", "active");

  liItems.append("a")
    .attr("href", "#tab" + peak)
    .attr("data-toggle", "tab")
    .text("Peak " + peak);

  tempValue = ( peak == 1 ) ? "row tab-pane active" : "row tab-pane";

  divItem = d3.select(".tab-content").append("div")
    .attr("id", "tab" + peak)
    .attr("class", tempValue)
    .append("div").attr("class", "span11 timeline");

  dataPeak = vizData.visualizations.activities_peaks_analysis.peaks_timeline['peak_' + peak];

  dataPeakCount = 0;
  for (key in dataPeak.events) dataPeakCount++;

  // 
  // Timeline
  //

  var format = d3.time.format("%Y-%m-%d %H:%M:%S");

  var data = d3.range(dataPeakCount).map(function(d) {
    return {x: format.parse(dataPeak.events[d+1].time.substr(0,19)), y: 1};
  });

  var margin = {top: 10, right: 20, bottom: 20, left: 20},
      width = $("#tab" + peak + " .timeline").width() - margin.left - margin.right,
      height = 60 - margin.top - margin.bottom;

  var min = d3.min(data, function(d) {return d.x;});
  var max = d3.max(data, function(d) {return d.x;});

  var x = d3.time.scale().domain([min, max]).range([0, width]);
  var y = d3.scale.linear().domain([0, 1]).range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  var svg = d3.select("#tab" + peak + " .timeline").append("svg")
      .datum(data)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "svg" + peak)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("path")
      .attr("class", "line")
      .attr("d", line)
      .attr('stroke-width', '.5px')
    .attr('stroke', 'steelblue');;

  svg.selectAll(".dot")
      .data(data.filter(function(d) { return d.y; }))
    .enter().append("circle")
      .attr("class", "dot")
      .attr("data-peak", peak)
      .attr("data-event", function(d, i) { return i; } )
      .attr("id", function(d, i) { return "peak" + peak + "_circle" + i})
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3)
      .attr("href", function (d, i) { return i })
      .attr("fill", 'white');

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

    // 
    // Tables
    //

    var calls = [];
    var durations = [];
    var durationsAverage = [];
    var sms = [];

    for(i in contacts) {
      if(contacts.hasOwnProperty(i)) {
        calls.push(0);
        durations.push(0);
        sms.push(0);
      }
    }

    for(key in dataPeak.events) {
        for( i in contacts ) {
          if( contacts[i] == dataPeak.events[key].contact ) {
            if ( dataPeak.events[key].channel == "call" ) {
              calls[i]++;
              durations[i] += dataPeak.events[key].duration;
              durationsAverage[i] = durations[i] / calls[i];
            } else if ( dataPeak.events[key].channel == "sms" ) {
              sms[i]++;
            }
          }
        }
    }

  events = []
  for (arg in dataPeak.events) {
    events.push(dataPeak.events[arg]);
  }

  // Buttons 

  $next = $("<button>").text(">>").click(function() { 
    next(peak, events.length);
    return null;
  });

  $prev = $("<button>").text("<<").click(function () {
    prev(peak);
    return null;
  });

  $nav = $("<div>")
    .addClass("span1")
    .attr("id", "nav_buttons")
    .append($prev)
    .append($next);
  
  $("#tab" + peak).append($nav);


  // Tables with events

  divItem.append("div").attr("id", "events" + peak).attr("class", "span12 events");

  $events = $("#events" + peak);
  $tableEvents = $("<table>").addClass("table table-striped table-bordered table-condensed")
  $tableEvents.append("<tr><th>time</th><th>channel</th><th>direction</th><th>contact</th><th>duration</th></tr>")

  events.forEach(function (event, i) {

      $contact = $("<td>").text(event.contact);
     $duration = $("<td>").text(human_readable_duration(event.duration));
    $direction = $("<td>").text(event.direction);
         $time = $("<td>").text(event.time.substr(0,19));
      $channel = $("<td>").text(event.channel);
    
    $event= $("<tr>")
      .attr("id", "peak" + peak + "_event" + i)
      .attr("data-peak", peak)
      .attr("data-event", i)
      .append($time)
      .append($channel)
      .append($direction)
      .append($contact)
      .append($duration);

    $tableEvents.append($event);

  });

  $events.append($tableEvents);



}

setBehaviors = function() {

  $(document).on("click",".dot", function(event){
    activate_event($(this).attr('data-peak'), $(this).attr('data-event'));
  });

  $(document).on("click","table tr", function(event){
    activate_event($(this).attr('data-peak'), $(this).attr('data-event'));
  });

  $('tr').each(function() {
    $(this).css('cursor', 'pointer');
  });

  $('.dot[data-event=0]').each(function() {
    activate_event($(this).attr('data-peak'), 0);
  });
  
}

$(window).resize(function() {
  $("ul.nav-tabs").html("");
  $("div.tab-content").html("");
  initViz();
});



vizData = JSON.parse(localStorage["data"]);
initViz();















