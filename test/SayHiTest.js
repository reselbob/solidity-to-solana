const dotenv = require('dotenv');
dotenv.config();
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey , TransactionInstruction, sendAndConfirmTransaction} = require("@solana/web3.js");
const {extractKeys} = require("./KeyExtractor");
const CONTRACT_ADDRESS = "FCDqnZTdfdfZ1i7Zmj2ZHBfaS1ug5hGkAhU94rk4Rh8p";


async function getMessage() {
  // Establish connection to the Solana network
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const blockhash = await connection.getLatestBlockhash();
  const keyData = await extractKeys();
  const wallet = keyData.keyPair;

  await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
  const getMessageFunctionId = "getMessage"; // Assuming it's a string identifier

  const programId = new PublicKey(CONTRACT_ADDRESS);

  const instruction = new TransactionInstruction({
    keys: [], // No accounts needed for this function call
    programId,
    data: Buffer.from(Uint8Array.from([
      ...Buffer.from(getMessageFunctionId, "utf8"), // Encode function identifier as bytes
    ])),
  });
  // Send the transaction
  const transaction = new Transaction().add(instruction);

  transaction.recentBlockhash = blockhash.blockhash;
  transaction.feePayer = wallet.publicKey
  transaction.partialSign(wallet);


  //transaction.partialSign(wallet);
  // Send the transaction
  const signature = await connection.sendTransaction(transaction);

  // Wait for the transaction to be confirmed
  await connection.confirmTransaction(signature, "finalized");

  // Get the account data
  const accountData = await connection.getAccountInfo(accountPublicKey);

  // Decode the message
  const message = accountData.data.toString("utf8");

  console.log("Message:", message);

}

// Call the function
getMessage().catch((error) => {
    console.error(error);
  });