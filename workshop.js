var request = require('request-promise');

// Euclidian distance between two points
function getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2));
}

function getIssPosition() {
    return request('http://api.open-notify.org/iss-now.json')
        .then(function(responce) {
                var data = JSON.parse(responce);
                // Parse as JSON
                // Return object with lat and lng
                var newObj = {
                    lat: data.iss_position.latitude,
                    lng: data.iss_position.longitude};
                return newObj;
            })
}
getIssPosition().then(function(pos){
    console.log('The position of ISS is', pos);
}).catch(function(error){
    console.log("OOPS, time to go home");
});

function getAddressPosition(address) {
    return request('https://maps.googleapis.com/maps/api/geocode/json?address=montreal')
    .then(function(response){
        var data = JSON.parse(response);
        var newObj = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        };
        return newObj;
    })
}
getAddressPosition().then(function(pos){
    console.log('The location is', pos);
}).catch(function(error){
    console.log('OOPS, time to go home');
});

function getCurrentTemperatureAtPosition(position) {
    return request('https://api.darksky.net/forecast/12056de9b1e199c9ecd80b6faabcc09e/37.8267,-122.4233')
    .then(function(response){
        var data = JSON.parse(response);
        return data.currently.temperature;
    })
}
getCurrentTemperatureAtPosition().then(function(pos){
    console.log('The temperature of current position is', pos);
}).catch(function(error){
    console.log('Time to go home.');
})

function getCurrentTemperature(address) {
   return getCurrentTemperatureAtPosition(getAddressPosition(address));
}

function getDistanceFromIss(address) {
    return Promise.all([
            getIssPosition(),
            getAddressPosition(address)
        ]).then(function(distance){
            return getDistance(distance[0], distance[1]);
        }).catch(function(error){
            console.log('Go home!');
        })
}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;