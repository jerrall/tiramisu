// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

/**
 * Deploy the example Greeter smart contract 
 * @param {string} message initial greeting
 * @returns {string} contract address
 */
 async function deployGreeter(message) {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();
  return greeter.address;
}

async function main() {
  const greeterAddress = await deployGreeter("Hello, Hardhat!");
  console.log("Greeter deployed to:", greeterAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
