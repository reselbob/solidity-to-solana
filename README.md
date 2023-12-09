# solidity-to-solana
A project that contains demonstration code for porting Solidity code to Solana

# Installation

## Install Rust

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

```
source "$HOME/.cargo/env"
```

```
rustup update
```

```
rustc --version
```

```
cargo --version
```

Choose option: `1) Proceed with installation (default)`

## Install NodeJs

```
sudo apt update -y
```

```
sudo apt install nodejs
```

```
sudo apt update nodejs
```

```
node -v
```

## Install TypeScript

```
npm install -g typescript
```

```
tsc --version
```

## Install solana

```
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

```
source ~/.profile
```

```
solana --version
```

```
echo "export PATH=$PATH:~/.local/share/solana/install/active_release/bin" >> ~/.bashrc

```

## Install solang

```
wget https://github.com/hyperledger/solang/releases/download/v0.3.3/solang-linux-x86-64
```

```
sudo mv solang-linux-x86-64 /usr/local/bin
```

```
sudo chmod +x /usr/local/bin/solang-linux-x86-64
```

```
solang solang --version
```

## Install anchor

- Install the Anchor CLI:

```
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
```
- Check the version to verify Anchor is up and running:

```
anchor --version
```
# Get the code
- Download the code from GitHub

```
git clone https://github.com/reselbob/solidity-to-solana
```

- Navigate to the source code working directory

```
cd solidity-to-solana
```
- Load the `node_modules`

```
npm install
```

# Getting the local Solana node up and running

- Configure the server to run on `localhost`

```
solana config set --url localhost
```
- Start the node running locally

```
solana-test-validator
```

- Create a keypair for local wallet at runtime

```
solana-keygen new
```

- Put the output, such as that shown below aside for later use

```
Wrote new keypair to /home/reselbob/.config/solana/id.json
===========================================================================
pubkey: 6cgC6roSkPCFyixUg9mNmQsVYVwaTLQi6nRZqZU7wBvT
===========================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
trick poet escape retire moe larry curly brown radar keen rail deputy
========================================================================
```

- Configure the development environment to use the keyPair generated previously

```
solana config set -k ~/.config/solana/id.json
```
You'll see output similar to the following:

```
Config File: ~/.config/solana/cli/config.yml
RPC URL: http://localhost:8899 
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: ~/.config/solana/id.json 
Commitment: confirmed
```
- Get some test SOL to pay for running the examples

```
solana airdrop 2
```
You'll see output similar to the following:

```
Requesting airdrop of 2 SOL

Signature: 62y4upyARbrcGNoq4wo8uwXeGJybavnAbDcUuNB6aeGKYzyk6Ys2A9s8EAFqQgVZkqUHfueAaD9RQ2RJegjoCfjM

2 SOL
```

# Configuring the `.env` file for the source code project

- Put the contents of `~/.config/solana/id.json` into a bash variable named `TEMP_BUFFER`

```
TEMP_BUFFER=$(cat ~/.config/solana/id.json)
```

- Create the .env file in the source code working directory using the value `$TEMP_BUFFER`

From within the source code working directory, execute the following command

```
echo WALLET_SECRET=\"$TEMP_BUFFER\" >> ./test/.env
```
This data is an encypted representation of the private and public keys for the wallet created earlier.

# Compiling and deploying simple Solidity code to solana

- Compile the code from within the root of the source code working directory

```
solang compile ./solidity/AddOperation.sol --target solana --output build
```
- The output will be sent to files in the `./build` folder in the root, like so:

```
  build
├── AddOperation.json
└── AddOperation.so
```

- Deploy the code from the root of the source code folder:

```
solana program deploy ./build/AddOperation.so
```
The output will be a report of the Program Id which needs to be saved for later use.

```
Program Id: 9qy8MRw4fLFESZGv8WGdjyVdo3koscdvvn1o1vvBLJ2e
```
