vizData = JSON.parse(localStorage["data"]);
initViz();

$(window).resize(function() {
  initViz();
});



function initViz() {

  dataDisplay(vizData.visualizations.phone_books_data);

}



function dataDisplay(data) {

	$('#calendar_use').text(data.calendar_use);
	$('#calendar_with_alarm').text(data.calendar_with_alarm);
	$('#calendar_with_recurrence').text(data.calendar_with_recurrence);

};
