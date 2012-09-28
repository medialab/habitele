// Language menu behaviors

$('ul.dropdown-menu a').on("click", function(event){
	setLang($(this).attr('data-lang'));
	$('li.dropdown').removeClass('open');
	return null
});

$('div.navbar').on('resize', function() {
	console.log($('div.navbar').height())
});



setLang();

function setLang(requestedLang)
{

	currentLang = localStorage["lang"];

	// Reset variable in case of error

	if ((currentLang != 'en') &&
		(currentLang != 'fr') &&
		(currentLang != 'ko') &&
		(currentLang != 'mr') &&
		(currentLang != 'pt')) {
			localStorage.removeItem('lang');
			currentLang = localStorage["lang"];
	}

	if ( requestedLang == null ) {

		if (currentLang == null) {
			// console.log('Set English')
			localStorage['lang'] = 'en';
			loadLanguage('en');
		} else {
			// console.log('Set current language')
			loadLanguage(currentLang);
		}
		
	} else {
		// console.log('Set requested language')
		localStorage['lang'] = requestedLang;
		loadLanguage(requestedLang);
	}

	return false;
}


function loadLanguage(lang) {
	d3.json("data/vocabularies/" + lang + ".json", function(json) {
		for(key in json) {
			$("[data-lang=" + key + "]").text(json[key]);
		}
	});
}