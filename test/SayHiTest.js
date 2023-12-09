const dotenv = require('dotenv');
dotenv.config();
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey , TransactionInstruction, sendAndConfirmTransaction} = require("@solana/web3.js");
const bs58 = require('bs58');
const {extractKeys} = require("./KeyExtractor");

const CONTRACT_ADDRESS = "26xJZw7RcNu7fRqDFuX6MSW3wL7xq7vH6EZE5QaSy1zE";
const FEE_PAYER_KEYPAIR = Keypair.generate();

async function getMessage() {
  // Establish connection to the Solana network
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const blockhash = await connection.getLatestBlockhash();
  const keyData = await extractKeys();
  const wallet = keyData.keyPair;

  await connection.requestAirdrop(FEE_PAYER_KEYPAIR.publicKey, LAMPORTS_PER_SOL);

  // Get the program ID from the contract address
  //const programId = await connection.getAccountInfo(CONTRACT_ADDRESS);

  const programId = CONTRACT_ADDRESS;

  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: [],
      programId,
      data: Buffer.from(
        Uint8Array.of(
          ...new TextEncoder().encode("getMessage"),
          0 // Length of message data (0 bytes)
        )
      ),
    })
  );

  transaction.partialSign(FEE_PAYER_KEYPAIR);
// Send the transaction
await connection.sendTransaction(transaction, {
    skipPreflight: false,
  });

    // Get the transaction confirmation
    const confirmation = await connection.confirmTransaction(transaction.signature, {
        skipPreflight: false,
      });
    // Decode the message from the transaction logs
  const messageData = confirmation.value.result.data;
  const message = new TextDecoder().decode(messageData);

  console.log("Message:", message);

 
}

// Call the function
getMessage().catch((error) => {
    console.error(error);
  });