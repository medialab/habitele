vizData = JSON.parse(localStorage["data"]);
initViz();

$(function() {

  // Function to resize bars

  $('#table_1 td, #table_2 td').filter(':odd').each(function(index) {

    barChart = $($(this).children(0)[0]);

    barChart.css({
      "background-color": "#bbb",
      "position": "absolute",
      "height": "20px",
      "width": $(this).width() * $(this).attr('number') / $(this).attr('max'),
      "z-index": "-1"
    });

  });

});

function initViz() {

  maxNumbers = [];

  // Table 1

  set_1 = ["top10_sms_in", "top10_mms_in", "top10_frequency_in", "top10_duration_in", "top10_sms_out", "top10_mms_out", "top10_frequency_out", "top10_duration_out"];

  $('#table_1 td').filter(':even').each(function(index) {
    n = parseInt((index/4).toString().split(".")[0]) + 1;
    value = n <= 10 ? n : n - 10;
    $(this).text(value);
    $(this).css({
      "text-align": "right",
      "width": "10px"
    });

  });

  $('#table_1 td').filter(':odd').each(function(index) {

    $(this).append('<div class="barchart"></div>');
    $(this).append('<div class="text"></div>');
    textChart = $($(this).children(0)[1]);
    n = parseInt((index/4).toString().split(".")[0]);

    // First 10

    if (n < 10) {
      d = (index/4).toFixed(2).substring(2);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_1[0]];
      else if (d == 25) data = vizData.visualizations.journal_of_calls[set_1[1]];
      else if (d == 50) data = vizData.visualizations.journal_of_calls[set_1[2]];
      else if (d == 75) data = vizData.visualizations.journal_of_calls[set_1[3]];
      if (data[n]) {
        if (n == 00) {
          if (d == 00) maxNumbers[0] = data[n].number;
          else if (d == 25) maxNumbers[1] = data[n].number;
          else if (d == 50) maxNumbers[2] = data[n].number;
          else if (d == 75) maxNumbers[3] = data[n].number;
        }
        textChart.text(data[n].contact);
        $(this).attr({
          "name": data[n].contact,
          "number": data[n].number,
        });
        if (d == 00) $(this).attr("max", maxNumbers[0]);
        else if (d == 25) $(this).attr("max", maxNumbers[1]);
        else if (d == 50) $(this).attr("max", maxNumbers[2]);
        else if (d == 75) $(this).attr("max", maxNumbers[3]);
      }

      // Second 10

    } else {
      d = (index/4).toFixed(2).substring(3);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_1[4]];
      else if (d == 25) data = vizData.visualizations.journal_of_calls[set_1[5]];
      else if (d == 50) data = vizData.visualizations.journal_of_calls[set_1[6]];
      else if (d == 75) data = vizData.visualizations.journal_of_calls[set_1[7]]; 
      if (data[n-10]) {
        if (n == 10) {
          if (d == 00) maxNumbers[4] = data[n-10].number;
          else if (d == 25) maxNumbers[5] = data[n-10].number;
          else if (d == 50) maxNumbers[6] = data[n-10].number;
          else if (d == 75) maxNumbers[7] = data[n-10].number;
        }
        textChart.text(data[n-10].contact);
        $(this).attr({
          "name": data[n-10].contact,
          "number": data[n-10].number
        });
        if (d == 00) $(this).attr("max", maxNumbers[4]);
        if (d == 25) $(this).attr("max", maxNumbers[5]);
        if (d == 50) $(this).attr("max", maxNumbers[6]);
        if (d == 75) $(this).attr("max", maxNumbers[7]);
      }
    }

  });

  

  // Table 2

  set_2 = ["top10_frequency_missed_calls", "top10_frequency_short_calls"]

  $('#table_2 td').filter(':even').each(function(index) {
    n = parseInt((index/1).toString().split(".")[0]) + 1;
    value = n <= 10 ? n : n - 10;
    $(this).text(value);
    $(this).css({
      "text-align": "right",
      "width": "10px"
    });
  });

  $('#table_2 td').filter(':odd').each(function(index) {

    $(this).append('<div class="barchart"></div>');
    $(this).append('<div class="text"></div>');
    textChart = $($(this).children(0)[1]);
    n = parseInt((index).toString().split(".")[0]);

    // First 10

    if (n < 10) {
      d = (index).toFixed(2).substring(2);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_2[0]];
      if (data[n]) {
        if (n == 00) {
          if (d == 00) maxNumbers[8] = data[n].number;
        }
        textChart.text(data[n].contact);
        $(this).attr({
          "name": data[n].contact,
          "number": data[n].number,
        });
        if (d == 00) $(this).attr("max", maxNumbers[8]);
      }

      // Second 10

    } else {
      d = (index).toFixed(2).substring(3);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_2[1]];
      if (data[n-10]) {
        if (n == 10) {
          if (d == 00) maxNumbers[9] = data[n-10].number;
        }
        textChart.text(data[n-10].contact);
        $(this).attr({
          "name": data[n-10].contact,
          "number": data[n-10].number
        });
        if (d == 00) $(this).attr("max", maxNumbers[9]);
      }
    }

  });

}

