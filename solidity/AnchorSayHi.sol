// Provide a unique program id that you can generate
// with the command solana-keygen new 
@program_id("3fuYYeHetUivCR7HWJ9n5AtiPq7Ztm2n45caxaYzG1Uy")
contract AnchorSayHi {
    @payer(payer)
    constructor() {
        print("Hi from Solidity code");
    }
}