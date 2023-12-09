const { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionInstruction, PublicKey, Transaction } = require("@solana/web3.js");
const borsh = require("borsh");
const {extractKeys} = require("./KeyExtractor");
const { Schema, Vec, U64 } = require('borsh');

// Replace these with your values
const PROGRAM_ID = "EGzhJdopGmZiQoKnaDZcj7RSxwBLWeziX8MoST1sDWFx"; // Replace with your program id
//const num1 = 10;
//const num2 = 20;

async function main() {
  // Connect to the cluster
  const connection = new Connection("http://localhost:8899", "confirmed");

  // Generate a keypair for the transaction
  const keyData = await extractKeys();
  const payerKeypair = keyData.keyPair;
  // Get the program account
  const programAccountId = new PublicKey(PROGRAM_ID);
  const programAccountInfo = await connection.getAccountInfo(programAccountId);

const value = {add: {num1: 10, num2: 20}};
//onst schema = { struct: { 'add': {kind: "struct", fields: [["num1", "u64"], ["num2", "u64"]] } }};
// Define the schema
const schema = {
  struct: {
    add: {
      struct: {
        num1: 'u8', // Unsigned 8-bit integer
        num2: 'u8', // Unsigned 8-bit integer
      },
    },
  },
};

const encodedInstruction = borsh.serialize(schema, value);

//const encodedInstruction = rootSchema.serialize(data);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: payerKeypair.publicKey, isSigner: true },
      { pubkey: programAccountId, isSigner: false },
    ],
    programId: programAccountId,
    data: encodedInstruction,
  });

  // Create a transaction
  const transaction = new Transaction({
    instructions: [instruction],
    feePayer: payerKeypair.publicKey,
    recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
  });

  // Sign the transaction
  transaction.partialSign(payerKeypair);

  // Send the transaction
  const transactionSignature = await connection.sendTransaction(transaction);

  // Wait for the transaction to be confirmed
  await connection.confirmTransaction(transactionSignature);

  // Get the result of the add function
  const decodedResult = borsh.decode({
    add: {
      result: "u64",
    },
  }, await connection.getAccountInfo(programAccountId, "confirmed"));

  console.log(`The sum of ${num1} and ${num2} is: ${decodedResult.add.result}`);
}

main().catch((error) => {
  console.error(error);
});
