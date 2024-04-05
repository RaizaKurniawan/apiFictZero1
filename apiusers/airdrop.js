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
        const nftId = 123456
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nftId // Add request body if required
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 200); // Assuming 200 for success
            assert.strictEqual(body.data.isAirdropClaimed, true);
            done();
        });
    });

    it('should return 400 Bad Request when sending value < 0 in nft id', function(done) {
        const nftId = -1;
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nftId
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(body.statusCode, 'BadRequest');
            done();
        });
    });

    it('should return 400 Bad Request when sending special characters into nft id', function(done) {
        const nftId = 'special_char_@';
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nftId
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(body.statusCode, 'BadRequest');
            done();
        });
    });

    it('should return 400 Bad Request when sending empty request body', function(done) {
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(body.statusCode, 'BadRequest');
            done();
        });
    });

    it('should return 400 Bad Request when sending empty nft id', function(done) {
        const nftId = '';
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nftId
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(body.statusCode, 'BadRequest');
            done();
        });
    });

    it('should return 400 Bad Request when sending 0 value in nft id', function(done) {
        const nftId = 0;
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nftId
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 400);
            assert.strictEqual(body.statusCode, 'BadRequest');
            done();
        });
    });

    it('should return 404 Not Found when NFT is not found', function(done) {
        const nonExistentNftId = 999999; // Assuming this ID does not exist in the database
        const options = {
            method: 'PUT',
            url: `${baseUrl}/airdrop`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            json: true,
            body: {
                "nftId": nonExistentNftId
            }
        };

        request(options, function(error, response, body) {
            if (error) return done(error);
            assert.strictEqual(response.statusCode, 404);
            assert.strictEqual(body.statusCode, 'NotFound');
            done();
        });
    });
});
