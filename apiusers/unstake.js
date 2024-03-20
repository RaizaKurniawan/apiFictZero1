const assert = require('assert');
const axios = require('axios');
const path = require('path');
const properties = require('properties');

// Load environment properties
let env;
properties.parse(path.resolve(__dirname, '../config/env.properties'), { path: true }, function (error, result) {
    if (error) return console.error(error);
    env = result;
});

// Test data
const baseURL = env.devURL; // You can change this to the appropriate environment
const validWalletAddress = 'valid_wallet_address'; // Insert valid wallet address here
const validNFTId = 'valid_nft_id'; // Insert valid NFT ID here
const nonExistentNFTId = 'non_existent_nft_id'; // Insert non-existent NFT ID here

describe('Epic FictZero API Services - Unstake NFT', function () {
    it('should unstake the NFT successfully', async function () {
        // Get random access token
        const accessToken = getRandomToken();

        // Prepare request body
        const requestBody = {
            wallet_address: validWalletAddress,
            nft_id: validNFTId
        };

        // Send PUT request to /stake endpoint
        const response = await axios.put(`${baseURL}/stake`, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            // Verify response status code
            assert.strictEqual(response.status, 200);

            // Verify response body
            assert.deepStrictEqual(response.data, {
                data: {
                    isStaked: false // Assuming the NFT is now unstaked
                }
            });
        }).catch((error) => {
            // Handle error
            console.error(error);
            throw error;
        });
    });
});

describe('Epic FictZero API Services - Unstake NFT Bad Request Cases', function () {
    it('should return 400 Bad Request when sending invalid data', async function () {
        // Get random access token
        const accessToken = getRandomToken();

        // Test cases for sending invalid data
        const invalidTestData = [
            { nft_id: -1, description: 'Send value less than 0 in nft id' },
            { nft_id: 'special!char', description: 'Send special char into nft id' },
            { nft_id: '', description: 'Send empty nft id' },
            { nft_id: 0, description: 'Send 0 value in nft id' },
            { requestBody: {}, description: 'Send empty request body' }
        ];

        // Iterate through each test case
        for (const testCase of invalidTestData) {
            try {
                // Prepare request body
                const requestBody = {
                    wallet_address: validWalletAddress,
                    nft_id: testCase.nft_id
                };

                // Send PUT request to /stake endpoint with invalid data
                const response = await axios.put(`${baseURL}/stake`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                // If the request succeeds, the test should fail
                assert.fail(`Test case failed: ${testCase.description}`);
            } catch (error) {
                // Verify response status code
                assert.strictEqual(error.response.status, 400, `Unexpected status code for test case: ${testCase.description}`);
                // Verify response body
                assert.deepStrictEqual(error.response.data, { statusCode: 'BadRequest' }, `Unexpected response body for test case: ${testCase.description}`);
            }
        }
    });
});
describe('Epic FictZero API Services - Unstake NFT - 404 Not Found Cases', function () {
    it('should return 404 Not Found when the NFT is not found', async function () {
        // Get random access token
        const accessToken = getRandomToken();

        try {
            // Prepare request body
            const requestBody = {
                wallet_address: validWalletAddress,
                nft_id: nonExistentNFTId
            };

            // Send PUT request to /stake endpoint with non-existent NFT ID
            const response = await axios.put(`${baseURL}/stake`, requestBody, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // If the request succeeds, the test should fail
            assert.fail(`Test case failed: NFT with ID ${nonExistentNFTId} should not be found.`);
        } catch (error) {
            // Verify response status code
            assert.strictEqual(error.response.status, 404, 'Unexpected status code.');

            // Verify response body
            assert.deepStrictEqual(error.response.data, { statusCode: 'NotFound' }, 'Unexpected response body.');
        }
    });
});