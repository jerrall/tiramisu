// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const MEMBER_ADDRESSES = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
];

/**
 * Deploy the example Greeter smart contract 
 * @param {string[]} memberAddresses addresses of the members of the group (sorted by payout order)
 * @returns {string} contract address
 */
 async function deployTiramisuExperiment(memberAddresses) {
  const TiramisueExperiment = await hre.ethers.getContractFactory("TiramisuExperiment");
  const tiramisuExperiment = await TiramisueExperiment.deploy(memberAddresses);

  await tiramisuExperiment.deployed();
  return tiramisuExperiment.address;
}

async function main() {
  const tiramisuExperimentAddress = await deployTiramisuExperiment(MEMBER_ADDRESSES);
  console.log("Tiramisue experiment deployed to:", tiramisuExperimentAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
