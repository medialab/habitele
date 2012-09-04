vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});



function initViz() {

  dataDisplay(vizData.visualizations.phone_books_data.applications_available);

}



function dataDisplay(data) {

  for (var i in data) {
      $('tbody').append('<tr>').append('<td>');
      $('tbody td').last().text(data[i]);
  }

};
