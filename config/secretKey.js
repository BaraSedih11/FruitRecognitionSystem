const crypto = require('crypto');

exports.getSecretKey = () => {
    const generateRandomKey = () => {
    return crypto.randomBytes(32).toString('hex');
    };
    return generateRandomKey();
}
