const assert = require('assert');
const request = require('request');
const getRandomToken = require('../config/tokenHelper');
const properties = require('properties');
const path = require('path');

// Load environment properties
properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, env) {
    if (error) return console.error(error);

    describe('Epic FictZero API Services - Get Wallet Info', function() {
        const baseUrl = env.devURL; // Menggunakan URL dev sebagai contoh, sesuaikan dengan kebutuhan Anda
        const validWalletAddress = 'valid_wallet_address'; // Ganti dengan alamat dompet yang valid
        const validnftId = '';

        describe('Scenario 1: Get Wallet Info', function() {
            it('should return wallet info with valid token access', function(done) {
                const randomToken = getRandomToken();
                const options = {
                    method: 'GET',
                    url: `${baseUrl}/wallet?address=${validWalletAddress}&nftId=${validnftId}`,
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

            it('401 - Should return unauthorized error with invalid token access', function(done) {
                const randomToken = getRandomToken();
                const options = {
                    method: 'GET',
                    url: `${baseUrl}/wallet?address=${validWalletAddress}&nftId=${validnftId}`,
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

            // Menambahkan skenario Bad Request
            describe('Scenario 2: Send Invalid random format key params', function() {
                it('should return 400 Bad Request', function(done) {
                    const randomToken = getRandomToken();
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?invalid_key=params`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };

                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 400);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.statusCode, 'BadRequest');
                        done();
                    });
                });
            });

            describe('Scenario 3: Send value "< 0" in wallet', function() {
                it('should return 400 Bad Request', function(done) {
                    const randomToken = getRandomToken();
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=-1`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };

                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 400);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.statusCode, 'BadRequest');
                        done();
                    });
                });
            });

            describe('Scenario 4: Send invalid wallet address format', function() {
                it('should return 400 Bad Request', function(done) {
                    const randomToken = getRandomToken();
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=invalid_address_format`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };

                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 400);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.statusCode, 'BadRequest');
                        done();
                    });
                });
            });

            describe('Scenario 5: Send special char into wallet', function() {
                it('should return 400 Bad Request', function(done) {
                    const randomToken = getRandomToken();
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=special_char_!@#$`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };

                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 400);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.statusCode, 'BadRequest');
                        done();
                    });
                });
            });

            describe('Scenario 6: Send empty wallet address', function() {
                it('should return 400 Bad Request', function(done) {
                    const randomToken = getRandomToken();
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };

                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 400);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.statusCode, 'BadRequest');
                        done();
                    });
                });
            });

            describe('Scenario 7: Ensure is not found - Adding invalid URL character', function() {
                it('should return 404 Not Found', function(done) {
                    const randomToken = getRandomToken();
                    const invalidCharacter = '@'; // Karakter URL tidak valid yang akan ditambahkan
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet${invalidCharacter}?address=${validWalletAddress}`,
                        headers: {
                            'Authorization': `Bearer ${randomToken}`
                        }
                    };
            
                    request(options, function(error, response, body) {
                        assert.equal(response.statusCode, 404);
                        const responseBody = JSON.parse(body);
                        assert.equal(responseBody.error, 'Not Found');
                        done();
                    });
                });
            });

            describe('Scenario 8: Authentication Failed - Invalid Token', function() {
                it('should return 401 Unauthorized', function(done) {
                    const invalidToken = 'invalid_token'; // Token yang tidak valid
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=${validWalletAddress}`,
                        headers: {
                            'Authorization': `Bearer ${invalidToken}`
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
            
            describe('Scenario 9: Authentication Failed - Empty Token', function() {
                it('should return 401 Unauthorized', function(done) {
                    const emptyToken = ''; // Token kosong
                    const options = {
                        method: 'GET',
                        url: `${baseUrl}/wallet?address=${validWalletAddress}`,
                        headers: {
                            'Authorization': `Bearer ${emptyToken}`
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
});
