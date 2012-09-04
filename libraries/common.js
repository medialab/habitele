function eliminateDuplicates(arr) {
  var i,
  len=arr.length,
  out=[],
  obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function human_readable_duration(duration) {
  seconds = duration % 60;  
  minutes = (duration - seconds) /60  %60;
  hours = (duration - minutes * 60 - seconds) / 3600; 

  str_seconds = seconds ? seconds + " seconds" : "";
  str_minutes = minutes ? minutes + " minutes" : "";
  str_hours = hours ? hours + " hours" : "";

  return str_hours + " " + str_minutes + " " + str_seconds; 
}