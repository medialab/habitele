vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  tdBehavior();
});

$(function() {
  tdBehavior();  
});

function tdBehavior() {

  // Tooltip

  $("[rel=tooltip]").tooltip({
    'placement': 'left'
  });

  $('#table_1 td, #table_2 td').filter(':odd').each(function(index) {

    // BackgroundChart resize

    $($(this).children(0)[0]).css({
      "position": "absolute",
      "height": $(this).height() + 8,
      "margin": "-4px 0 0 -5px",
      "width": ($(this).width() + 10),
      "z-index": "-2"
    });

    // BarChart resize

    $($(this).children(0)[1]).css({
      "background-color": "steelblue",
      "position": "absolute",
      "height": $(this).height() + 8,
      "margin": "-4px 0 0 -5px",
      "opacity": ".15",
      "width": ($(this).width() + 10) * $(this).attr('number') / $(this).attr('max'),
      "z-index": "-1"
    });

    // Mouseover effect

    active = function(obj) {
      $(obj.children(0)[0]).css({
        'background-color': 'steelblue',
        'opacity': '.85'
      });
      $(obj.children(0)[1]).css('opacity', '1');
      $(obj.children(0)[2]).children().css('color', 'white');
    }

    inactive = function(obj) {
      $(obj.children(0)[0]).css({
        'background-color': 'transparent',
        'opacity': '1'
      });
      $(obj.children(0)[1]).css('opacity', '.15');
      $(obj.children(0)[2]).children().css('color', 'black');
    }

    $(this).mouseenter(function() {
      if ($($(this).children(0)[2]).text()) {
        active($(this));
        $('[name="' + $(this).attr('name') + '"]').each(function() {
          active($(this));
        });
        $($(this).children(0)[2]).children().tooltip('show');
      }
    }).mouseleave(function() {
      inactive($(this));
      $('[name="' + $(this).attr('name') + '"]').each(function() {
        inactive($(this));
      });
      $($(this).children(0)[2]).children().tooltip('hide');
    });

  });

}

function initViz() {

  maxNumbers = [];

  // Table 1

  set_1 = ["top10_sms_in", "top10_mms_in", "top10_frequency_in", "top10_duration_in", "top10_sms_out", "top10_mms_out", "top10_frequency_out", "top10_duration_out"];

  $('#table_1 td').filter(':even').each(function(index) {
    n = parseInt((index/4).toString().split(".")[0]) + 1;
    value = n <= 10 ? n : n - 10;
    $(this).html(value);
    $(this).css({
      "text-align": "right",
      "width": "10px",
      'font-size': '11px'
    });

  });

  $('#table_1 td').filter(':odd').each(function(index) {

    $(this).append('<div class="background"></div>');
    $(this).append('<div class="barchart"></div>');
    $(this).append('<div class="text"></div>');
    textChart = $($(this).children(0)[2]);
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
        textChart.html('<a rel="tooltip" title="' + data[n].number + '">' + data[n].contact) + '</a>';
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
        textChart.html('<a href="#" rel="tooltip" title="' + data[n-10].number + '">' + data[n-10].contact) + '</a>';
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
      "width": "10px",
      'font-size': '11px'
    });
  });

  $('#table_2 td').filter(':odd').each(function(index) {

    $(this).append('<div class="background"></div>');
    $(this).append('<div class="barchart"></div>');
    $(this).append('<div class="text"></div>');
    textChart = $($(this).children(0)[2]);
    n = parseInt((index).toString().split(".")[0]);

    // First 10

    if (n < 10) {
      d = (index).toFixed(2).substring(2);
      if (d == 00) data = vizData.visualizations.journal_of_calls[set_2[0]];
      if (data[n]) {
        if (n == 00) {
          if (d == 00) maxNumbers[8] = data[n].number;
        }
        textChart.html('<a href="#" rel="tooltip" title="' + data[n].number + '">' + data[n].contact) + '</a>';
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
        textChart.html('<a href="#" rel="tooltip" title="' + data[n-10].number + '">' + data[n-10].contact) + '</a>';
        $(this).attr({
          "name": data[n-10].contact,
          "number": data[n-10].number
        });
        if (d == 00) $(this).attr("max", maxNumbers[9]);
      }
    }

  });

}

