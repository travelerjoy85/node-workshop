var getIssPosition = require('../workshop').getIssPosition;
var nock = require('nock');

describe('getIssPosition', function() {
    it('Should return the ISS position', function() {
        nock('http://api.open-notify.org')
            .get('/iss-now.json')
            .reply(200, {
                timestamp: 1491964542,
                message: "success",
                iss_position: {
                    longitude: "60.1234",
                    latitude: "-45.1234"
                }
            });

        return getIssPosition()
            .then(function(position) {
                expect(position.lat).to.equal("-45.1234");
                expect(position.lng).to.equal("60.1234");
            });
    });
});