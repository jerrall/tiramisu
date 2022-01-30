# Tiramisu Savings Club

(This is a starter for the Tirasimu Savings Club project. Initial code taken from Nader Dabit's tutorial - see below for URL)

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

## Onboarding your developer environment

### Clone the repository

```bash
git clone https://github.com/jerrall/tiramisu.git
```

### [Optional] Install node version manager (nvm) if you want to be able to switch between versions of node easily
- Mac/Linux: https://github.com/nvm-sh/nvm
- Windows: https://github.com/coreybutler/nvm-windows

### Install node
We are using node v16 for this project

If you want to install the standalone version of node, download [here](https://nodejs.org/en/download/)

If you want to use nvm
```bash
nvm install 16
nvm use 16
```

### Install node modules

```
cd tiramisu
npm install
# You should see node_modules\ contain stuff now
```

## Open Visual Studio Code

Open this folder in Visual Studio Code
If you get prompted to install extensions - do it :)

## Configure environment variables

```bash
cp ./example.env ./.env
nano ./env # Update all the values in here with secrets from Alchemy, Etherscan, and Metamask
```

## Running the project

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

Aliases for the above tasks also exist in package.json npm scripts and Visual Studio code tasks (Command + Shift + P ==> Tasks)

## How to deploy

Please add an entry to src/deployments.json 
The front end uses the last address in that array

### Rinkeby

To deploy to Rinkeby, run ```npm run hardhat:deploy:rinkeby```

### Arbitrum-Rinkeby

1. Add a connection to the Arbitrum-Rinkeby network in MetaMask: https://developer.offchainlabs.com/docs/public_testnet#connecting-to-the-chain
2. Make sure you are on the normal L1 Rinkeby network in Metamask
3. Bridge some ETH to the Arbitrum-Rinkeby L2 (takes ~10 minutes for your deposit to show up in L2)
https://bridge.arbitrum.io/
4. Switch to the Arbitrum-Rinkeby L2 network in Metamask to confirm your deposit is complete (you need L2 eth to deploy)
4. Then run ```npm run hardhat:deploy:arbitrumRinkeby```

## How to verify contract source on Etherscan

Add the deployed contract address to the ```hardhat:verify:rinkeby``` script in package.json
Run ```npm run hardhat:verify:rinkeby``` to verify the source code
Make sure you added the etherscan API key from Discord to your .env file (which is intentionally gitignore'd)
Source should then start to appear on Etherscan

## Code review checklist

Make sure this command passes before you open a pull request
```bash
npm run check
```

This will run all sorts of stuff that absolutely should pass to ensure a high quality of code

Tutorial by Nader Dabit this was taken from:
https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
