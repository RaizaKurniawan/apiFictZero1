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
const stakeOptionId = 'stake_option_id'; // Insert stake option ID here

describe('Epic FictZero API Services - Stake NFT', function () {
  it('should stake the NFT successfully', async function () {
    // Get random access token
    const accessToken = getRandomToken();

    // Prepare request body
    const requestBody = {
      wallet_address: validWalletAddress,
      nft_id: validNFTId,
      stake_option_id: stakeOptionId
    };

    // Send POST request to /stake endpoint
    const response = await axios.post(`${baseURL}/stake`, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Verify response status code
    assert.strictEqual(response.status, 200);

    // Verify response body
        assert.strictEqual(response.data.message, 'ok');
        assert.strictEqual(response.data.statusCode, 'OK');
    // assert.strictEqual(response.data.success, true);
    // assert.strictEqual(response.data.message, 'NFT has been successfully staked.');
  });

  describe('Epic FictZero API Services - 400 Bad Request Cases', function () {
    it('should return 400 Bad Request when sending value "< 0" in NFT ID', async function () {
      const nftId = -1; // Sending value "< 0" in NFT ID
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: nftId,
        stake_option_id: 'valid_stake_option_id'
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending special characters into NFT ID', async function () {
      const nftId = 'special!characters'; // Sending special characters into NFT ID
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: nftId,
        stake_option_id: 'valid_stake_option_id'
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending an empty request body', async function () {
      const requestBody = {}; // Sending an empty request body
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending an empty NFT ID', async function () {
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: '', // Sending an empty NFT ID
        stake_option_id: 'valid_stake_option_id'
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending 0 value in NFT ID', async function () {
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: 0, // Sending 0 value in NFT ID
        stake_option_id: 'valid_stake_option_id'
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending 0 value in stake option ID', async function () {
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: 'valid_nft_id',
        stake_option_id: 0 // Sending 0 value in stake option ID
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  
    it('should return 400 Bad Request when sending value "< 0" in stake option ID', async function () {
      const stakeOptionId = -1; // Sending value "< 0" in stake option ID
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: 'valid_nft_id',
        stake_option_id: stakeOptionId
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 400 Bad Request');
      } catch (error) {
        assert.strictEqual(error.response.status, 400);
        assert.strictEqual(error.response.data.statusCode, 'BadRequest');
      }
    });
  });

  describe('Epic FictZero API Services - 404 Not Found Cases', function () {
    it('should return 404 Not Found when the NFT is not found', async function () {
      const nonExistentNFTId = 'non_existent_nft_id';
      const requestBody = {
        wallet_address: 'valid_wallet_address',
        nft_id: nonExistentNFTId,
        stake_option_id: 'valid_stake_option_id'
      };
  
      try {
        await axios.post(`${baseURL}/stake`, requestBody);
        // If no error is thrown, the test case should fail
        assert.fail('Expected request to fail with 404 Not Found');
      } catch (error) {
        assert.strictEqual(error.response.status, 404);
        assert.strictEqual(error.response.data.statusCode, 'NotFound');
      }
    });
  });
});


