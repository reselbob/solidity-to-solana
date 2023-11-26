const fs = require('fs');

const pathToIdJson = `${process.env.HOME}/.config/solana/id.json`;

// Read the id.json file
fs.readFile(pathToIdJson, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the id.json file:', err);
        return;
    }

    try {
        const idJson = JSON.parse(data);
        const privateKeyBase64 = idJson.secretKey;

        // Decode base64 encoded private key to get the binary data
        const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');

        // Convert the binary data to a hexadecimal string (the private key)
        const privateKeyHex = privateKeyBuffer.toString('hex');

        console.log('Private Key:', privateKeyHex);
    } catch (error) {
        console.error('Error parsing id.json content:', error);
    }
});
