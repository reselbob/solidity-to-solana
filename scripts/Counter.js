const dotenv = require('dotenv');
dotenv.config();
const { Connection, Transaction, LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } = require("@solana/web3.js");
const bs58 = require('bs58');
const {extractKeys} = require("./KeyExtractor");

const CONTRACT_ADDRESS = "6hzQd46Ejv1Ks85jgqRyxvod1enzXasER2TqiAb7srHQ";


async function main() {
  // Establish connection to the Solana network
  const connection = new Connection('http://localhost:8899', 'confirmed');
  const blockhash = await connection.getLatestBlockhash();
  const keyData = await extractKeys();
  const wallet = keyData.keyPair;

  await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
  const getMessageFunctionId = "increment"; // Assuming it's a string identifier

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

  // Send the transaction
  //const signature = await connection.sendTransaction(transaction);

  // Wait for the transaction to be confirmed
  //await connection.confirmTransaction(signature, "finalized");

  // Get the account data
  //const accountData = await connection.getAccountInfo(accountPublicKey);

  // Decode the message
  //const message = accountData.data.toString("utf8");

  //console.log("Message:", message);
}

// Call the function
main().catch((error) => {
    console.error(error);
  });