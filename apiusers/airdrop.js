const assert = require('assert');
const request = require('request');
const getRandomToken = require('../config/tokenHelper');
const properties = require('properties');
const path = require('path');

describe('Epic FictZero API Services - Airdrop', function() {
    let token;
    let baseUrl;

    // Load environment properties
    before(function(done) {
        properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, env) {
            if (error) return done(error);
            token = getRandomToken(); // Generate random token
            baseUrl = env.devURL; // Assuming the property name for API base URL is devURL
            done();
        });
    });

    it('should claim airdrop successfully', function(done) {
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                // Add request body if required
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 200); // Assuming 200 for success
            assert.strictEqual(body.data.isAirdropClaimed, true);
            done();
        });
    });
});
