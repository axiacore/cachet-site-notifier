function loadCachet(cachetUrl, callback) {
  var createAlert = function(incident) {
    var divElement = document.createElement('div');
    divElement.id = 'cachet-alert';
    divElement.setAttribute('style', 'background-color: #FF3D2E; text-align: center; font-family: sans-serif;');
    divElement.innerHTML = '<a style="color: #fff; display: block; padding: 5px;" href="'+ cachetUrl +'" target="_blank">'+ incident.name +'</a>';
    document.body.insertBefore(divElement, document.body.children[0]);
    if (callback) {
      callback();
    }
  };

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var incident = JSON.parse(xmlhttp.responseText).data[0];
        if (incident !== undefined){
          if (incident.status !== 4  && incident.status !== 0) {
            createAlert(incident);
          } else {
            var xmlhttp2 = new XMLHttpRequest();
            xmlhttp2.onreadystatechange = function() {
              if (xmlhttp2.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp2.status == 200) {
                  var scheduledIncident = JSON.parse(xmlhttp2.responseText).data[0];
                  if (scheduledIncident !== undefined){
                    if (new Date(scheduledIncident.scheduled_at) > new Date()) {
                      createAlert(scheduledIncident);
                    }
                  }
                }
              }
            };

            xmlhttp2.open('GET', cachetUrl + '/api/v1/incidents/?sort=id&order=desc&per_page=1&status=0', true);
            xmlhttp2.send();
          }
        }
      }
    }
  };

  xmlhttp.open('GET', cachetUrl + '/api/v1/incidents/?sort=id&order=desc&per_page=1', true);
  xmlhttp.send();
}
