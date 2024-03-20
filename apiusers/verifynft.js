const assert = require('assert');
const axios = require('axios');
const path = require('path');
const properties = require('properties');
const getRandomToken = require('../config/tokenHelper');
// Load environment properties
let env;
properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, result) {
    if (error) return console.error(error);
    env = result;
});

// Test data
const baseURL = env.devURL; // You can change this to the appropriate environment
//const validWalletAddress = 'valid_wallet_address'; // Insert valid wallet address here
const validNFTId = 'valid_nft_id'; // Insert valid NFT ID here
const nonExistentNFTId = 'non_existent_nft_id'; // Insert non-existent NFT ID here
const invalidNFTIds = ['<0', 'special_char', '', '0']; // Daftar ID NFT yang tidak valid


describe('Epic FictZero API Services - This nft is already stake', function () {
    it('should return 200 OK and indicate NFT is already staked', async function () {
        // Get random access token
        const accessToken = getRandomToken();
        const options = {
            method: 'GET',
            url: `${baseUrl}/stake/verify?nftId=${validNFTId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        try {
            const response = await axios(options);

            // Validasi respons body
            assert.equal(response.status, 200);
            assert.ok(response.data.hasOwnProperty('data'));
            assert.ok(response.data.data.hasOwnProperty('isStaked'));

            // Pastikan bahwa isStaked ada di antara nilai true atau false
            assert.ok(typeof response.data.data.isStaked === 'boolean');

            // Anda dapat menambahkan asersi tambahan sesuai kebutuhan
        } catch (error) {
            // Tangani kesalahan
            throw error;
        }
    });
});

describe('Epic FictZero API Services - 400 Bad Request cases', function () {
    invalidNFTIds.forEach((nftId, index) => {
        it(`should return 400 Bad Request for invalid NFT ID (${index + 1})`, async function () {
            // Dapatkan token akses acak
            const accessToken = getRandomToken();
            const options = {
                method: 'GET',
                url: `${baseURL}/stake/verify?nftId=${nftId}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }

            try {
                const response = await axios(options);

                // Validasi bahwa respons harus menghasilkan status 400 Bad Request
                assert.equal(response.status, 400);
                // Validasi bahwa statusCode dalam respons body adalah "BadRequest"
                assert.equal(response.data.statusCode, "BadRequest");
            } catch (error) {
                // Tangani kesalahan
                throw error;
            }
        });
    });
});

describe('Epic FictZero API Services - 404 Not Found cases', function () {
    it('should return 404 Not Found when NFT is not found', async function () {
        // Dapatkan token akses acak
        const accessToken = getRandomToken();
        const options = {
            method: 'GET',
            url: `${baseURL}/stake/verify?nftId=${nonExistentNFTId}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        try {
            const response = await axios(options);

            // Validasi bahwa respons harus menghasilkan status 404 Not Found
            assert.equal(response.status, 404);
            // Validasi bahwa statusCode dalam respons body adalah "NotFound"
            assert.equal(response.data.statusCode, "NotFound");
        } catch (error) {
            // Tangani kesalahan
            throw error;
        }
    });
});