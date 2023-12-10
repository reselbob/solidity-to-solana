const dotenv = require('dotenv');
dotenv.config();
const { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, Keypair, PublicKey } = require("@solana/web3.js");
const {extractKeys} = require("./KeyExtractor");

const ABI = {
    version: "0.0.1",
    name: "Counter",
    instructions: [
      {
        name: "new",
        accounts: [
          {
            name: "dataAccount",
            isMut: true,
            isSigner: false,
            isOptional: false,
          },
        ],
        args: [],
      },
      {
        name: "increment",
        accounts: [
          {
            name: "dataAccount",
            isMut: true,
            isSigner: false,
            isOptional: false,
          },
        ],
        args: [],
      },
      {
        name: "get",
        accounts: [
          {
            name: "dataAccount",
            isMut: false,
            isSigner: false,
            isOptional: false,
          },
        ],
        args: [],
        returns: "u64",
      },
    ],
  };

  
// Replace this with your wallet address
//const WALLET_ADDRESS = "YOUR_WALLET_ADDRESS";

// Replace this with the program ID
const PROGRAM_ID = "4D7x2h8nRQteb7XtfjPxexp2CYo52qGdxszKLm52Qgb5";

const connection = new Connection('http://localhost:8899', 'confirmed');

// Create a new account to hold the counter data
const dataAccount = Keypair.generate();

// Replace this with your payer keypair
const payerKeypair = Keypair.generate();

// Generate a new keypair for the data account
const dataAccountKeypair = Keypair.generate();

async function main() {
    const keyData = await extractKeys();
    const wallet = keyData.keyPair;

    const createDataAccountTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: wallet.publicKey,
          lamports: LAMPORTS_PER_SOL,
          space: 8,
          programId: new PublicKey(PROGRAM_ID),
        })
      );
    
    
    await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * 2);
  
    await sendTransactionWithRetry(connection, wallet, createDataAccountTransaction);
    console.log("Data account created:", wallet.publicKey.toString());
  
    await sendTransactionWithRetry(connection, wallet, incrementCounterTransaction);
    console.log("Counter incremented");

  
    const counterValue = await getCounterValue(connection, dataAccountKeypair.publicKey);
    console.log("Counter value:", counterValue);
  }
  
  async function sendTransactionWithRetry(connection, payer, transaction) {
    for (let i = 0; i < 5; i++) {
      try {
        await connection.sendTransaction(transaction, [payer]);
        return;
      } catch (error) {
        console.warn("Error sending transaction:", error.message);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    throw new Error("Failed to send transaction after 5 retries");
  }
  
  async function getCounterValue(connection, dataAccount) {
    const getDataTransaction = new Transaction().add(
      new Instruction({
        programId: PROGRAM_ID,
        keys: [{ pubkey: dataAccount, isSigner: false, isWritable: false }],
        data: Buffer.from(ABI.instructions.find((instruction) => instruction.name === "get").index),
      })
    );
  
    const response = await connection.sendTransaction(getDataTransaction, []);
    const data = await connection.getTransaction(response).result.value.data;
    return parseInt(Buffer.from(data).toString("utf8"), 10);
  }

main().catch((error) => {
  console.error(error);
});
