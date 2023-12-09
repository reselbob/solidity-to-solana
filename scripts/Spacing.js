const web3 = require("@solana/web3.js");
const { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey , TransactionInstruction} = require("@solana/web3.js");

async function main() {
// Airdrop SOL for paying transactions
let payer = web3.Keypair.generate();
const connection = new Connection('http://localhost:8899', 'confirmed');

let airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  web3.LAMPORTS_PER_SOL,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Allocate Account Data
let allocatedAccount = web3.Keypair.generate();
let allocateInstruction = web3.SystemProgram.allocate({
  accountPubkey: allocatedAccount.publicKey,
  space: 100,
});
let transaction = new web3.Transaction().add(allocateInstruction);

await web3.sendAndConfirmTransaction(connection, transaction, [
  payer,
  allocatedAccount,
]);

// Create Nonce Account
let nonceAccount = web3.Keypair.generate();
let minimumAmountForNonceAccount =
  await connection.getMinimumBalanceForRentExemption(web3.NONCE_ACCOUNT_LENGTH);
let createNonceAccountTransaction = new web3.Transaction().add(
  web3.SystemProgram.createNonceAccount({
    fromPubkey: payer.publicKey,
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
    lamports: minimumAmountForNonceAccount,
  }),
);

await web3.sendAndConfirmTransaction(
  connection,
  createNonceAccountTransaction,
  [payer, nonceAccount],
);

// Advance nonce - Used to create transactions as an account custodian
let advanceNonceTransaction = new web3.Transaction().add(
  web3.SystemProgram.nonceAdvance({
    noncePubkey: nonceAccount.publicKey,
    authorizedPubkey: payer.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, advanceNonceTransaction, [
  payer,
]);

// Transfer lamports between accounts
let toAccount = web3.Keypair.generate();

let transferTransaction = new web3.Transaction().add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }),
);
await web3.sendAndConfirmTransaction(connection, transferTransaction, [payer]);

// Assign a new account to a program
let programId = web3.Keypair.generate();
let assignedAccount = web3.Keypair.generate();

let assignTransaction = new web3.Transaction().add(
  web3.SystemProgram.assign({
    accountPubkey: assignedAccount.publicKey,
    programId: programId.publicKey,
  }),
);

await web3.sendAndConfirmTransaction(connection, assignTransaction, [
  payer,
  assignedAccount,
]);
}

main().catch((error) => console.error(error));