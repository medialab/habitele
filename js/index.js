if ( !localStorage["data"] ) {
  $(".after_loaded").hide();

}

function handleFileSelect(evt) {
  if ($("#stored_files").text() === "None") {
      $("#stored_files").text("")
  }
  var files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
   
      var reader = new FileReader();
      reader.onload = (function(file) { 
                          return function(e) {
                              localStorage["data"] = e.target.result
                              
                 $(".after_loaded").show(1500);
                 $(".before_loaded").hide();
                  vizData = JSON.parse(localStorage["data"]);  
                 
                          }})(f);
      reader.readAsText(f);
  

  
  
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';


}

document.getElementById('files').addEventListener('change', handleFileSelect, false);