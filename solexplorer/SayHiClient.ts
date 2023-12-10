// This code is meant to be run run as client code within Solana Explorer
// https://explorer.solana.com/

console.log("My address:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

const testKp = new web3.Keypair();

async function callGetMessage() {
  // get the metrics on the program
  const accountInfo = await pg.connection.getAccountInfo(pg.PROGRAM_ID);
  if (accountInfo?.data) {
    // Decode the message from the account data
    const message = Buffer.from(accountInfo.data).toString("utf8");
    console.log(
      `The size of Program ID ${pg.PROGRAM_ID} is ${accountInfo?.data.length}`
    );
  } else {
    console.log("No data found for the account");
  }

  const instruction = new web3.TransactionInstruction({
    keys: [], // Add account keys if required by the program
    programId: pg.PROGRAM_ID,
    data: Buffer.alloc(0), // No instruction data needed for getMessage()
  });

  const lamports = await pg.connection.getMinimumBalanceForRentExemption(8);

  const transaction = new web3.Transaction().add(instruction);

  transaction.feePayer = pg.wallet.publicKey;

  const txHash = await web3.sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [pg.wallet.keypair]
  );

  console.log(`Transaction confirmed: ${txHash}`);

  const transactionResponse = await pg.connection.getTransaction(txHash);

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
