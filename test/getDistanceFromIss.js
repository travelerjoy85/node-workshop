var getDistanceFromIss = require('../workshop').getDistanceFromIss;
var nock = require('nock');

describe('getDistanceFromIss', function() {
    it('Should return the distance from the ISS using Promise.all', function() {

        nock('http://api.open-notify.org')
            .get('/iss-now.json')
            .reply(200, {
                timestamp: 1491964542,
                message: "success",
                iss_position: {
                    longitude: "10",
                    latitude: "20"
                }
            });

        nock('https://maps.googleapis.com')
            .get('/maps/api/geocode/json')
            .query(true)
            .reply(200, {
                results: [
                    {
                        geometry: {
                            location: {
                                lat: 23,
                                lng: 14
                            }
                        }
                    }
                ],
                status: "OK"
            });

        chai.spy.on(Promise, 'all');

        return getDistanceFromIss("montreal")
            .then(function(distance) {
                expect(distance).to.equal(5); // The data was fixed so that the sides of the triangle are 3 4 5.
                expect(Promise.all).to.have.been.called.at.least(1);
            });
    });
});