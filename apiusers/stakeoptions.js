const assert = require('assert');
const request = require('request');
const getRandomToken = require('../config/tokenHelper');
const properties = require('properties');
const path = require('path');

describe('Epic FictZero API Services', function () {
    let baseUrl;

    before(function (done) {
        properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, env) {
            if (error) return done(error);
            baseUrl = env.BASE_URL; // Assuming BASE_URL is defined in env.properties
            done();
        });
    });

    describe('GET /stake/options', function () {
        it('should return all available stake options with id', function (done) {
            const token = getRandomToken(); // Assuming getRandomToken() returns a valid JWT token
            const options = {
                url: `${baseUrl}/stake/options`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            request(options, function (error, response, body) {
                if (error) return done(error);

                const statusCode = response.statusCode;
                const responseBody = JSON.parse(body);

                // Assertion for status code
                assert.strictEqual(statusCode, 200, 'Expected status code to be 200');
                // Additional assertions can be added based on the response body

                done();
            });
        });
    });
});
