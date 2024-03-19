const assert = require('assert');
const request = require('request');
const getRandomToken = require('../config/tokenHelper');
const properties = require('properties');

// Load environment properties
    // properties.parse('../config/env.properties', { path: true }, function (error, env) {
    //     if (error) return console.error(error);

    properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, env) {
        if (error) return console.error(error);

    describe('Epic FictZero API Services - Get Wallet Info', function() {
        const baseUrl = env.devURL; // Menggunakan URL dev sebagai contoh, sesuaikan dengan kebutuhan Anda
        const validWalletAddress = 'valid_wallet_address'; // Ganti dengan alamat dompet yang valid

        describe('Scenario 1: Get Wallet Info', function() {
            it('should return wallet info with valid token access', function(done) {
                const randomToken = getRandomToken();
                const options = {
                    method: 'GET',
                    url: `${baseUrl}/wallet?address=${validWalletAddress}`,
                    headers: {
                        'Authorization': `Bearer ${randomToken}`
                    }
                };

                request(options, function(error, response, body) {
                    assert.equal(response.statusCode, 200);
                    const responseBody = JSON.parse(body);
                    
                    // Ekspektasi respons body
                    const expectedResponseBody = {
                        data: {
                            walletAddress: validWalletAddress
                        },
                        meta: null,
                        error: null,
                        message: 'ok',
                        statusCode: 'OK'
                    };

                    // Validasi respons body
                    assert.deepEqual(responseBody, expectedResponseBody);

                    done();
                });
            });

            it('should return unauthorized error with invalid token access', function(done) {
                const randomToken = getRandomToken();
                const options = {
                    method: 'GET',
                    url: `${baseUrl}/wallet?address=${validWalletAddress}`,
                    headers: {
                        'Authorization': `Bearer ${randomToken}`
                    }
                };

                request(options, function(error, response, body) {
                    assert.equal(response.statusCode, 401);
                    const responseBody = JSON.parse(body);
                    assert.equal(responseBody.error, 'Unauthorized');
                    done();
                });
            });
        });
    });
});
