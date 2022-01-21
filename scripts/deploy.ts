// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

/**
 * Deploy the example Greeter smart contract 
 * @param {string[]} memberAddresses addresses of the members of the group (sorted by payout order)
 * @returns {string} contract address
 */
 async function deployTiramisuSavingsClub() {
  const TiramisuSavingsGroup = await ethers.getContractFactory("TiramisuSavingsClub");
  const tiramisuSavingsGroup = await TiramisuSavingsGroup.deploy();

  await tiramisuSavingsGroup.deployed();
  return tiramisuSavingsGroup.address;
}

async function main() {
  const contractAddress = await deployTiramisuSavingsClub();
  console.log("Savings group contract deployed to:", contractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
