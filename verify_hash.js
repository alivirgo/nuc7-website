const crypto = require('crypto');
const password = 'nuc7!nuc7!';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('Password:', password);
console.log('SHA-256 Hash:', hash);
