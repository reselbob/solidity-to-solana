# solidity-to-solana
A project that contains demonstration code for porting Solidity code to Solana

- Installation
    - [Install Rust](#install-rust)
    - [Install NodeJs](#install-nodejs)
    - [Install Yarn](#install-yarn)
    - [Install TypeScript](#install-typescript)
    - [Install Solana](#install-solana)
    - [Install Solang](#install-solang)
    - [Install Anchor](#install-anchor)
- [Get the code](#get-the-code)
- [Getting the local Solana blockchain node up and running](#getting-the-local-solana-blockchain-node-up-and-running)
- [Creating a wallet in code](#creating-a-wallet-in-code)
- [Get some SOL](#get-some-sol)
- [Configuring the `.env` file for the source code project](#configuring-the-env-file-for-the-source-code-project)
- [Running a test to execute a simple transfer of SOL on the local Solana node](d#running-a-test-to-execute-a-simple-transfer-of-sol-on-the-local-solana-node)
- [Compiling and deploying simple Solidity code to solana](#compiling-and-deploying-simple-solidity-code-to-solana)
- [Exercising the deployment with a NodeJS Web3 client](#exercising-the-deployment-with-a-nodejs-web3-client)
- [Exercising the deployment using the Anchor framework](#exercising-the-deployment-using-the-anchor-framework)

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

## Install Yarn
You'll need it to run the tests under Anchor

```
sudo npm install --global yarn
```

## Install TypeScript

```
npm install -g typescript
```

```
tsc --version
```

## Install Solana

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

## Install Solang

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

## Install Anchor

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

# Getting the local Solana blockchain node up and running

- Configure the server to run on `localhost`

```
solana config set --url localhost
```
- Start the node running locally

```
solana-test-validator
```

# Creating a wallet in code

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

# Get some SOL

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

- Create the `.env` file in the source code working directory using the value `$TEMP_BUFFER`

From within the source code working directory, execute the following command

```
echo WALLET_SECRET=\"$TEMP_BUFFER\" >> ./test/.env
```
This data is an encypted representation of the private and public keys for the wallet created earlier.

# Running a test to execute a simple transfer of SOL on the local Solana node

- Navigate to the `test` folder in the source code working directory
```
cd ./test
```

- Take a snapshot of the balance of SOL held in the local wallet

```
solana balance
```

You'll get output similar to the following assuming that you've done `solana airdrop 2` previously.

```
2
```

- Run the test
```
node SimpleTest
```

You'll see output similar to the following:

```
1 SOL transfered from 6gXC3f8cQ7tXHsx4ANfdTcNhEiJkb19QWbzFj88SFRce to 7eVYGEVAE35FKCyXsjBR2aCYbgpJaiBdZoYXmhWaMCNb
```
- Take another snapshot of the balance of SOL held in the local wallet

```
solana balance
```
You'll get output similar to the following which is 1 less SOL than the beginning balance.

```
1
```


# Compiling and deploying simple Solidity code to solana

- Compile the code from within the root of the source code working directory

```
solang compile ./solidity/SayHiContract.sol --target solana --output build
```
- The output will be sent to files in the `./build` folder in the root, like so:

```
  build
├── SayHiContract.json
└── SayHiContract.so
```

- Deploy the code from the root of the source code folder:

```
solana program deploy ./build/SayHiContract.so
```
The output will be a report of the Program Id which needs to be saved for later use.

```
Program Id: 26xJZw7RcNu7fRqDFuX6MSW3wL7xq7vH6EZE5QaSy1zE
```

# Exercising the deployment with a NodeJS Web3 client

- Navigate to the `./test` folder

```
cd test
```

MORE TO COME

# Exercising the deployment using the Anchor framework



