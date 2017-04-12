var getCurrentTemperature = require('../workshop').getCurrentTemperature;
var nock = require('nock');

describe('getCurrentTemperature', function() {
    it('Should return the current temperature', function() {

        nock('https://maps.googleapis.com')
            .get('/maps/api/geocode/json')
            .query(true)
            .reply(200, {
                results: [
                    {
                        geometry: {
                            location: {
                                lat: 45.5,
                                lng: -73.5
                            }
                        }
                    }
                ],
                status: "OK"
            });

        nock('https://api.darksky.net')
            .get(/\/forecast\/.*/)
            .reply(200, {
                currently: {
                    temperature: 42
                }
            });

        return getCurrentTemperature("montreal")
            .then(function(temperature) {
                expect(temperature).to.equal(42);
            });
    });
});