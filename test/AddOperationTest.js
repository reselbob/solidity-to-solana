const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const { Connection, Keypair, Transaction, SystemProgram } = require("@solana/web3.js");
const { Solana } = require('solana-client-js');
const solanaClient = new Solana();
const {getKeys} = require('./KeyExtractor');
//const  { BorshEncoder } = require('@solana/borsh');
const borsh = require('borsh');

// Replace these with your actual values
const PROGRAM_ID = "9qy8MRw4fLFESZGv8WGdjyVdo3koscdvvn1o1vvBLJ2e";
const RPC_ENDPOINT = "http://localhost:8899"; // Local Solana node endpoint
const WALLET_SECRET = ""; // Secret key of your wallet
const NUM1 = 10; // First number for addition
const NUM2 = 20; // Second number for addition



async function main() {

  const keys = await getKeys();
  // Establish connection to the local Solana node
  const connection = new Connection(RPC_ENDPOINT);

  // Generate a keypair for the transaction fee payer
  //const feePayer = Keypair.generate();


  console.log(keys.private);
  const solkey = JSON.parse(process.env.WALLET_SECRET);
  // Get the wallet keypair from the secret
  const wallet = Keypair.fromSecretKey(Uint8Array.from(solkey));

  const schema = {
    struct: {
      instruction: 'string',
      num1: 'u8',
      num2: 'u8',
    }
  };

  const obj = {
    instruction: "AddOperation", // Function name
    num1: NUM1, // First number
    num2: NUM2, // Second number
  };

  const encodedData = borsh.serialize(schema, obj);

  // Create an instruction to invoke the AddOperation function
  const addInstruction = {
    programId: PROGRAM_ID,
    accounts: [
      {
        pubkey: keys.public,
        isSigner: true, // Fee payer
      },
      {
        pubkey: keys.public, // Your wallet account
        isSigner: true, // Signing the transaction
      },
    ],
    data: encodedData,
  };

  // Create a transaction and add the instruction
  const transaction = new Transaction();
  transaction.addInstruction(addInstruction);

  // Sign the transaction with the fee payer and wallet
  transaction.sign(feePayer, wallet);

  // Send the transaction to the Solana network
  const txHash = await connection.sendTransaction(transaction);
  console.log(`Transaction sent: ${txHash}`);

  // Get the transaction receipt to confirm success
  const receipt = await connection.getTransactionReceipt(txHash);
  if (receipt.status === "success") {
    console.log("AddOperation successful!");
  } else {
    console.error("AddOperation failed:", receipt.error);
  }
}

main().catch((error) => console.error(error));

// Import Borsh encoder for data serialization (replace with your actual import)


