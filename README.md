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
If you get prompted to install the Solidity extension - do it :)

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

Tutorial by Nader Dabit this was taken from:
https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
