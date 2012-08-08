var lang = window.navigator.userLanguage || window.navigator.language;

setLanguege(lang.substr(0, 2));

function setLanguege(lang) {

	if ( lang == "en" ) { loadLanguage(lang); }
}

function loadLanguage(lang) {
	d3.json("data/vocabularies/" + lang + ".json", function(json) {

		for(key in json.data) {
			$("." + json.data[key].class)
				.text(json.data[key].value);
		}

	});
}