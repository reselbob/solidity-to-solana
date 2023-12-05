const { Connection, Keypair, Transaction, SystemProgram } = require("@solana/web3.js");

// Replace these with your actual values
const PROGRAM_ID = "8tRKdj34cvV7Sueab9u1kcSL6g4Xmc7zzGT5WPz9R3Ui";
const RPC_ENDPOINT = "http://localhost:8899"; // Local Solana node endpoint
const WALLET_SECRET = ""; // Secret key of your wallet
const NUM1 = 10; // First number for addition
const NUM2 = 20; // Second number for addition

async function main() {
  // Establish connection to the local Solana node
  const connection = new Connection(RPC_ENDPOINT);

  // Generate a keypair for the transaction fee payer
  const feePayer = Keypair.generate();

  // Get the wallet keypair from the secret
  const wallet = Keypair.fromSecretKey(Uint8Array.from(WALLET_SECRET));

  // Create an instruction to invoke the AddOperation function
  const addInstruction = {
    programId: PROGRAM_ID,
    accounts: [
      {
        pubkey: feePayer.publicKey,
        isSigner: true, // Fee payer
      },
      {
        pubkey: wallet.publicKey, // Your wallet account
        isSigner: true, // Signing the transaction
      },
    ],
    data: Borsh.encoder({
      instruction: "AddOperation", // Function name
      num1: NUM1, // First number
      num2: NUM2, // Second number
    }),
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
import { BorshEncoder } from "@solana/borsh";

