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

}

function getCurrentTemperatureAtPosition(position) {

}

function getCurrentTemperature(address) {

}

function getDistanceFromIss(address) {

}

exports.getIssPosition = getIssPosition;
exports.getAddressPosition = getAddressPosition;
exports.getCurrentTemperatureAtPosition = getCurrentTemperatureAtPosition;
exports.getCurrentTemperature = getCurrentTemperature;
exports.getDistanceFromIss = getDistanceFromIss;