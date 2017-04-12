var getAddressPosition = require('../workshop').getAddressPosition;
var nock = require('nock');

describe('getAddressPosition', function() {
    it('Should return the position of an address', function() {
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

        return getAddressPosition("montreal")
            .then(function(position) {
                expect(position.lat).to.equal(45.5);
                expect(position.lng).to.equal(-73.5);
            });
    });
});