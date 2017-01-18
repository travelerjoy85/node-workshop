var request = require('request');
var prompt = require('prompt');

var googleAPIurl = "https://maps.googleapis.com/maps/api/geocode/json?address="
var issAPIurl = "http://api.open-notify.org/iss-now.json"

Number.prototype.toRadians = function() {
  return this * Math.PI / 180;
}

prompt.get(['location'], function(error1, res1) {
    var userLocation = res1.location;
    request(googleAPIurl + userLocation, function(error2, res2, body2) {
        var data = JSON.parse(body2);
        var location = data.results[0].geometry.location;
        var userLat = location.lat;
        var userLng = location.lng;

        request(issAPIurl, function(error3, res3, body3) {
            var data = JSON.parse(body3);
            var issLat = Number(data.iss_position.latitude);
            var issLng = Number(data.iss_position.longitude);

            var distance = haversineDistance(userLat, userLng, issLat, issLng)
            // convert to KM and round to nearest integer.
            distance = Math.floor(distance/1000)
            console.log(`The ISS is ${distance} km away from you.`);
        });
    });
});

function haversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // metres
  var φ1 = lat1.toRadians();
  var φ2 = lat2.toRadians();
  var Δφ = (lat2-lat1).toRadians();
  var Δλ = (lon2-lon1).toRadians();

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
