const axios = require('axios');
const assert = require('assert');
const jwt = require('jsonwebtoken');

describe('FZ Application - /wallet/email Endpoint Test', function() {
    const baseURL = 'https://application-api-dev.fictzero.com/api/v1'; // Ganti dengan URL dasar API Anda

    // Fungsi untuk mendapatkan token JWT
    async function getToken() {
        const payload = {
            address: "0x09852A76C2B7F0F2F0A54398A2BAC1A1AD07C2C7",
            jti: 1000001,
            exp: 1755917282
        };
        const secret = "abcdefghijklmnoprstuvwxyz11234567890";
        const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
        return token;
    }

    // Pengujian dengan token JWT
    it('Should successfully send email with JWT authorization', async function() {
        // Mendapatkan token JWT
        const token = await getToken();

        // Data yang akan dikirim
        const data = {
            email: 'abc@example.com',
            communityCode: null // Opsional, sesuai dengan permintaan
        };

        // Konfigurasi header untuk request
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Melakukan request POST ke endpoint /wallet/email
        const response = await axios.put(`${baseURL}/wallet/email`, data, { headers });

        // Memeriksa apakah respons adalah sukses (status kode 200 OK)
        assert.strictEqual(response.status, 200);
        // Di sini Anda bisa menambahkan lebih banyak pengujian sesuai dengan kebutuhan aplikasi Anda
    });

    // Pengujian tanpa token JWT
    it('Should fail without JWT authorization', async function() {
        // Data yang akan dikirim
        const data = {
            email: 'abc@example.com',
            communityCode: null // Opsional, sesuai dengan permintaan
        };

        // Konfigurasi header untuk request tanpa token JWT
        const headers = {
            'Content-Type': 'application/json'
        };

        // Melakukan request POST ke endpoint /wallet/email tanpa token JWT
        try {
            await axios.put(`${baseURL}/wallet/email`, data, { headers });
        } catch (error) {
            // Memeriksa apakah respons adalah tidak diizinkan (status kode 401 Unauthorized)
            assert.strictEqual(error.response.status, 401);
            // Di sini Anda bisa menambahkan lebih banyak pengujian sesuai dengan kebutuhan aplikasi Anda
            return;
        }
        // Jika tidak ada kesalahan yang dilempar, maka pengujian akan gagal
        assert.fail('Expected request to fail without JWT authorization');
    });
    it('Should return 400 Bad Request for invalid email addresses', async function() {
        // Mendapatkan token JWT
        const token = await getToken();

        // Data dengan daftar alamat email yang tidak valid
        const invalidEmails = require('./invalidEmails.json');

        // Konfigurasi header untuk request
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Looping melalui setiap alamat email yang tidak valid
        for (const email of invalidEmails) {
            // Melakukan request PUT ke endpoint /wallet/email dengan alamat email yang tidak valid
            try {
                await axios.put(`${baseURL}/wallet/email`, { email }, { headers });
            } catch (error) {
                // Memeriksa apakah respons adalah 400 Bad Request
                assert.strictEqual(error.response.status, 400);
                // Memeriksa apakah pesan kesalahan yang diterima sesuai dengan yang diharapkan
                assert.strictEqual(error.response.data.statusCode, "BadRequest");
                continue;
            }
            // Jika tidak ada kesalahan yang dilempar, maka pengujian akan gagal
            assert.fail(`Expected request to fail with 400 Bad Request for invalid email: ${email}`);
        }
    });
});
