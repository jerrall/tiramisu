// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const { getAccounts } = require("../utils");

/**
 * Deploy the example Greeter smart contract 
 * @param {string[]} memberAddresses addresses of the members of the group (sorted by payout order)
 * @returns {string} contract address
 */
 async function deployTiramisuExperiment(memberAddresses) {
  const TiramisuSavingsGroup = await ethers.getContractFactory("TiramisuFactoryStrategy");
  const tiramisuSavingsGroup = await TiramisuSavingsGroup.deploy(memberAddresses);

  await tiramisuSavingsGroup.deployed();
  return tiramisuSavingsGroup.address;
}

async function main() {
  const accounts = await getAccounts(10);
  const addresses = accounts.map(account => account.address);
  console.log('Deploying savings group contract with the following addresses as group members', addresses);
  const tiramisuExperimentAddress = await deployTiramisuExperiment(addresses);
  console.log("Savings group contract deployed to:", tiramisuExperimentAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
