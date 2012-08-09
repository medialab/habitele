vizData = JSON.parse(localStorage["data"]);
initViz();

function initViz() {
  dataDisplay("top10_sms_in");
  dataDisplay("top10_sms_out");
  dataDisplay("top10_mms_in");
  dataDisplay("top10_mms_out");
  dataDisplay("top10_frequency_in");
  dataDisplay("top10_frequency_out");
  dataDisplay("top10_duration_in");
  dataDisplay("top10_duration_out");

  dataDisplay("top10_frequency_missed_calls");
  dataDisplay("top10_frequency_short_calls");
}


function dataDisplay(list) {

  var top10_sms_in = vizData.visualizations.journal_of_calls[list];

  items = d3.select("#"+list)
    .append("tbody")
    .selectAll("tr")
    .data(top10_sms_in)
    .enter()
    .append("tr");

  items.append("td")
    .text(function(d){return d.contact;})
  items.append("td")
    .text(function(d){return d.number;})

};