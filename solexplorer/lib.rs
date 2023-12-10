// This Rust code is meant to be compiled into a Solana program under
// Solana Explorer. It is not meant to be compiled into a native binary.

// Define the necessary Solana program dependencies
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

// Entry point function for the Solana program
entrypoint!(process_instruction);

// Define the function that returns the message
fn get_message() -> String {
    String::from("Hi from Solana!")
}

// Function to process Solana program instructions
fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    // Implement your program logic here if needed
    // For demonstration purposes, we'll just print the message to the console
    msg!("{}", get_message());

    Ok(())
}
