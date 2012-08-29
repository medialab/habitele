vizData = JSON.parse(localStorage["data"]);
initViz();

function initViz() {

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

    n = parseInt((index/4).toString().split(".")[0]);

    if (n < 10) {
      d = (index/4).toFixed(2).substring(2);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_1[0]];
      if (d == 25) data = vizData.visualizations.journal_of_calls[set_1[1]];
      if (d == 50) data = vizData.visualizations.journal_of_calls[set_1[2]];
      if (d == 75) data = vizData.visualizations.journal_of_calls[set_1[3]];
      if (data[n]) $(this).text(data[n].contact); 
    } else {
      d = (index/4).toFixed(2).substring(3);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_1[4]];
      if (d == 25) data = vizData.visualizations.journal_of_calls[set_1[5]];
      if (d == 50) data = vizData.visualizations.journal_of_calls[set_1[6]];
      if (d == 75) data = vizData.visualizations.journal_of_calls[set_1[7]];  
      if (data[n-10]) $(this).text(data[n-10].contact); 
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

    n = parseInt((index/1).toString().split(".")[0]);

    if (n < 10) {
      d = (index/4).toFixed(2).substring(2);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_2[0]];
      if (data[n]) $(this).text(data[n].contact); 
    } else {
      d = (index/4).toFixed(2).substring(3);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_2[1]];
      if (data[n-10]) $(this).text(data[n-10].contact); 
    }

  });

}

