$(function() {

  if ( !localStorage["data"] ) {
    $(".after_loaded").hide();
  }

  function handleFileSelect(evt) {
    
    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
     
        var reader = new FileReader();

        reader.onload = (function(file) { 
          
          return function(e) {
            
            localStorage["data"] = e.target.result
            $(".after_loaded").show();
            $(".before_loaded").hide();
            vizData = JSON.parse(localStorage["data"]);  

          }

        })(f);

        reader.readAsText(f);
       
    }
    
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);

});