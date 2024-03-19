// config/tokenHelper.js
const headers = require('./300tokens');

function getRandomToken() {
    const unusedTokens = headers.filter(token => !token.used);
    const randomIndex = Math.floor(Math.random() * unusedTokens.length);
    const randomToken = unusedTokens[randomIndex];
    randomToken.used = true; // tandai token sebagai digunakan
    return randomToken.token;
}

module.exports = getRandomToken;