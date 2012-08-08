setCookie(document.cookie.split("=")[1]);

function setCookie(requestedLang)
{
	requestedLang = (requestedLang) ? requestedLang.substr(0, 2) : "";
	currentLang = (document.cookie.split("=")[1]) ? document.cookie.split("=")[1] : "";

	// console.log("requestedLang " + requestedLang)
	// console.log("currentLang " + currentLang)

	// First use, nothing exists

	if ( requestedLang == "" && currentLang == "" ) {
		console.log("First use, nothing exists")
		lang = "en"; // Default
		document.cookie = "lang=" + lang;
		loadLanguage(lang);
	}

	// Second use, requestedLang and currentLang are the same

	if ( requestedLang == currentLang ) {
		console.log("Second use, requestedLang and currentLang are the same")
		lang = currentLang; // Reused
		loadLanguage(lang);
	}

	// Third case, requestedLang and currentLang are different, user wants to change language

	if ( requestedLang != currentLang ) {
		console.log("Third case, requestedLang and currentLang are different, user wants to change language")
		lang = requestedLang;
		document.cookie = "lang=" + lang;
		window.location.reload();
	}

	return false;
}


function loadLanguage(lang) {
	d3.json("data/vocabularies/" + lang + ".json", function(json) {

		for(key in json.data) {
			$("." + json.data[key].class)
				.text(json.data[key].value);
		}
		
	});
}