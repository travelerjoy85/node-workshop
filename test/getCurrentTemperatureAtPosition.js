var getCurrentTemperatureAtPosition = require('../workshop').getCurrentTemperatureAtPosition;
var nock = require('nock');

describe('getCurrentTemperatureAtPosition', function() {
    it('Should return the current temperature', function() {
        nock('https://api.darksky.net')
            .get(/\/forecast\/.*/)
            .reply(200, {
                currently: {
                    temperature: 42
                }
            });

        return getCurrentTemperatureAtPosition({lat: 1, lng: 1})
            .then(function(temperature) {
                expect(temperature).to.equal(42);
            });
    });
});