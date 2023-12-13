const {
    Connection,
    Keypair,
    Transaction,
    PublicKey,
    sendAndConfirmTransaction,
  } = require("@solana/web3.js");
  
  const { extractKeys } = require("./KeyExtractor");
  
  const { Program, AnchorProvider } = require("@coral-xyz/anchor");
  // Generated IDL file
  const IDL = require("../build/AnchorSayHi.json");
  const CONTRACT_ADDRESS = "<PUT_GENERATED_PROGRAM_ID_HERE>";
  
  
  async function callGetMessage() {
  
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
    const programId = new PublicKey(CONTRACT_ADDRESS)
  
    const keyData = await extractKeys();
    const wallet = keyData.keyPair;
  
    // Set up Anchor client using program IDL
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(IDL, programId, provider);
  
    // Generate random keypair for "data account" created by "new" instruction
    const dataAccount = Keypair.generate();
  
    // Create instruction to invoke "new" instruction on program
    const instruction = await program.methods
        .new() // For Solang, the constructor is always the "new" instruction
        .accounts({ dataAccount: dataAccount.publicKey })
        .instruction();
  
    // Add instruction to transaction         
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = wallet.publicKey;
  
    // Send transaction
    const txHash = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet, dataAccount]
    );
    console.log(`Transaction confirmed: ${txHash}`);
  
    const transactionResponse = await connection.getTransaction(txHash);
    // Print out the transaction program logs
    console.log(JSON.stringify(transactionResponse.meta.logMessages, null, 2));
  }
  
  // Call the function to interact with the Solana program
  callGetMessage().catch((error) => {
    console.error("Error:", error);
  });