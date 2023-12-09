const dotenv = require('dotenv');
dotenv.config();
const { Keypair } = require("@solana/web3.js");

async function extractKeys() {
    const solkey = JSON.parse(process.env.WALLET_SECRET);
    let secretKey = Uint8Array.from(solkey);
    let keypair = Keypair.fromSecretKey(secretKey);

    const hexString = Buffer.from(keypair.secretKey).toString('hex');

    const obj = {secretKey: keypair.secretKey,
        secretKeyAsHexStr:hexString,
        publicKey: keypair.publicKey,
        keyPair: keypair
    }

    //console.log(JSON.stringify(obj));
    return obj;

}

//extractKeys().catch((error) => console.error(error));

module.exports = {extractKeys}

