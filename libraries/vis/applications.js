vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  $('tbody').text('');
  initViz();
});



function initViz() {

  dataDisplay(vizData.visualizations.phone_books_data.applications_available);

}



function dataDisplay(data) {

  for (var i in data) {

  	if (i%4 === 0) $('tbody').append('<tr>');
  	$('tbody tr').last().append('<td>');
  	$('tbody td').last().attr('width', '25%').text(data[i]);

  }

};
