const {
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const { extractKeys } = require("./KeyExtractor");

const CONTRACT_ADDRESS = "FwBhFazLzHua2XruVJWbmf49Gtp61Vfa1tnpjYujfJTc";
async function callGetMessage() {

  const connection = new Connection('http://localhost:8899', 'confirmed');
  const programId = new PublicKey(CONTRACT_ADDRESS)

  const keyData = await extractKeys();
  const wallet = keyData.keyPair;

  // Client
  console.log("My address:", wallet.publicKey.toString());
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`My balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  // get the metrics on the program
  const accountInfo = await connection.getAccountInfo(programId);
  if (accountInfo?.data) {
      console.log(
          `The size of Program ID ${CONTRACT_ADDRESS} is ${accountInfo?.data.length}`
      );
  } else {
      console.log("No data found for the account");
  }

  const instruction = new TransactionInstruction({
      keys: [], // Add account keys if required by the program
      programId: programId,
      data: Buffer.alloc(0), // No instruction data needed for getMessage()
  });

  const lamports = await connection.getMinimumBalanceForRentExemption(accountInfo?.data.length || 0);

  const transaction = new Transaction().add(instruction);

  transaction.feePayer = wallet.publicKey;

  const txHash = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
  );

  console.log(`Transaction confirmed: ${txHash}`);

  const transactionResponse = await connection.getTransaction(txHash);

  //Take a look at the entire response. What the hell.
  console.log(JSON.stringify(transactionResponse, null, 2));

  // Extract the message from the transaction logs
  const message = transactionResponse.meta.logMessages.find((log) =>
      log.includes("Hi from Solana!")
  );

  if (message) {
      console.log("Message:", message);
  } else {
      console.error("Failed to retrieve message");
  }
}

// Call the function to interact with the Solana program
callGetMessage().catch((error) => {
  console.error("Error:", error);
});
