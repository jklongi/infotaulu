var map = L.map('map', {
	center: [60.20468677990855,24.958276748657227],
	zoom: 13,
	attributionControl: false
})

L.tileLayer('http://beta.digitransit.fi/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: 'hsl-map'
}).addTo(map);


var markers = L.layerGroup();

var getLineColor = function(code){
	return code.replace(/\D/g,'').length == 1 ? 'green' : 
		code == "75" ? 'orange' : 
		'cyan';
};



(function poll(){
   setTimeout(function(){
      $.ajax({ url: "http://dev.hsl.fi/siriaccess/vm/json?operatorRef=HSL", success: function(data){
        markers.clearLayers();
		$.each(data.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity, function(index, obj){
			var vehicle = obj.MonitoredVehicleJourney,
				lon = vehicle.VehicleLocation.Longitude,
				lat = vehicle.VehicleLocation.Latitude,
				lineCode = vehicle.LineRef.value,
				line = lineCode.substring(1).replace(/^0+/, '');

			if(vehicle.Delay && $("." + line).length ){
				var delay = parseInt((vehicle.Delay/60).toFixed(0)), info;
				if(delay !== 0){
					if(delay < 0){
						info = "-" + Math.abs(delay);
					} else {
						info = "+" + Math.abs(delay);
					}
				}
				$('.'+line).html(info);
				
			}

			var myMarker = L.ExtraMarkers.icon({
			    icon: 'fa-number',
			    markerColor: getLineColor(line),
			    shape: 'circle',
			    prefix: 'fa',
			    number: line
			  });
			var marker = L.marker([lat, lon], {icon: myMarker});
			markers.addLayer(marker);
		})
		markers.addTo(map);

        poll();
      }, dataType: "json"});
  }, 4000);
})();
