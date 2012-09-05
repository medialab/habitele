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

	columns = 4;

	loop = data.length - data.length%columns;
	loop = (data.length%columns == 0) ? loop : loop + columns;

	for (i=0; i < loop; i++) {
		if (i%columns === 0) $('tbody').append('<tr>');
		$('tbody tr').last().append('<td>');
		$('tbody td').last().attr('width', '25%').text(data[i]);
	}

};
