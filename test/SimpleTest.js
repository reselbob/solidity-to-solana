const dotenv = require('dotenv');
dotenv.config();
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require("@solana/web3.js");
const bs58 = require('bs58');
const {extractKeys} = require("./KeyExtractor");

async function main() {
    const connection = new Connection('http://localhost:8899', 'confirmed');
    const keyData = await extractKeys();
    const account = keyData.keyPair;
    const account2 = Keypair.generate();

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: account.publicKey,
            toPubkey: account2.publicKey,
            lamports: LAMPORTS_PER_SOL * 1
        })
    );

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [account]
    );
}

main().catch((error) => console.error(error));