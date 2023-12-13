// Provide a unique program id that you can generate
// with the command solana-keygen new 
@program_id("<PUT_GENERATED_PROGRAM_ID_HERE>")
contract AnchorSayHi {
    @payer(payer)
    constructor() {
        print("Hi from Solidity code");
    }
}