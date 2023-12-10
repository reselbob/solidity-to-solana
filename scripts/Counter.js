const dotenv = require('dotenv');
dotenv.config();
const { Connection, Transaction, LAMPORTS_PER_SOL, PublicKey, Keypair, TransactionInstruction, SystemProgram,
  sendAndConfirmTransaction } = require("@solana/web3.js");
const bs58 = require('bs58');
const {extractKeys} = require("./KeyExtractor");

const CONTRACT_ADDRESS = "4D7x2h8nRQteb7XtfjPxexp2CYo52qGdxszKLm52Qgb5";


async function main() {
  // Establish connection to the Solana network
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const blockhash = await connection.getLatestBlockhash();
  const keyData = await extractKeys();
  const wallet = keyData.keyPair;
  const programId = new PublicKey(CONTRACT_ADDRESS);
  const dataAccount = Keypair.generate();

  await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
  const getMessageFunctionId = "increment"; // Assuming it's a string identifier


   // Create the transaction
   const transaction = new Transaction();

   // Create the instruction to initialize the counter
   const newInstruction = {
     programId: programId,
     keys: [{ pubkey: wallet.publicKey, isSigner: false, isWritable: true }],
     data: Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]),
   };
 
   // Add the instruction to the transaction
   transaction.add(newInstruction);
 
   // Send the transaction
   const signature = await connection.sendTransaction(transaction, wallet);
   console.log(`Transaction signature: ${signature}`);
 
   // Wait for the transaction to be confirmed
   await connection.confirmTransaction(signature);
 
   // Get the current counter value
   const count = await getCount(dataAccount.publicKey);
   console.log(`Current counter value: ${count}`);
}

// Call the function
main().catch((error) => {
    console.error(error);
  });