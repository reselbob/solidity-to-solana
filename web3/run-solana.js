const { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } = require('@solana/web3.js');

// Replace 'http://localhost:8899' with your local Solana node endpoint
const connection = new Connection('http://localhost:8899', 'confirmed');

// Public key of the deployed Solana smart contract
const contractPublicKey = new PublicKey('YOUR_CONTRACT_PUBLIC_KEY');

// Replace 'YOUR_ACCOUNT_PRIVATE_KEY' with the private key of your Solana account
const accountPrivateKey = 'YOUR_ACCOUNT_PRIVATE_KEY';

async function interactWithContract() {
    // Replace 'YOUR_NEW_NUMBER' with the new number you want to set in the contract
    const newNumber = 42;

    const fromWallet = new Account(Buffer.from(accountPrivateKey, 'hex'));

    // Create a transaction instruction to interact with the smart contract
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: fromWallet.publicKey, isSigner: true, isWritable: false }],
        programId: contractPublicKey,
        data: Buffer.from(Uint8Array.of(newNumber)),
    });

    // Sign the transaction
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = fromWallet.publicKey;

    // Send the transaction to the local Solana node
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromWallet], // Specify the signing accounts
        {
            skipPreflight: false,
            commitment: 'confirmed',
        }
    );

    console.log('Transaction successful with signature:', signature);
}

// Call the function to interact with the Solana smart contract
interactWithContract().catch((error) => console.error(error));
