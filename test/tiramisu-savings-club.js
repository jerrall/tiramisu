const { expect, use } = require("chai");
const { describe, test } = require("mocha");
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");
const { getAccounts } = require("../utils");

// augment missing functionality in chai, helpful for dealing with async operations
use(chaiAsPromised);

describe("Tiramisu savings club", () => {
  const NUM_TEST_ACCOUNTS = 10;
  let accounts; // list of NUM_TEST_ACCOUNTS accounts
  let addresses; // list of NUM_TEST_ACCOUNTS addresses
  let names; // Placeholder for human readable names, using UPPERCASE of address for now

  let contract; // deployed contract object

  // runs once before the first test in this block
  // eslint-disable-next-line no-undef 
  before(async () => {
    // Generate 10 test accounts deterministically from hardhat
    accounts = await getAccounts(NUM_TEST_ACCOUNTS);

    // Map this list of accounts to a list of addresses for convenience
    addresses = accounts.map(account => account.address);

    names = addresses.map(address => address.toUpperCase());
  });

  // `beforeEach` will run before each test, re-deploying the contract every time
  beforeEach(async () => {
    const factory = await ethers.getContractFactory("TiramisuSavingsClub");
    contract = await factory.deploy();
  
    await contract.deployed();
  });

  /**
   * Helper that sequentially deposits the same amount using all accounts
   * @param {number} amount (wei)
   */
   const allAccountsDeposit = async (amount) => {
    // Each account deposits same amount of wei
    for (let i = 0; i < accounts.length; i++) {
      await contract.connect(accounts[i]).deposit({ value: amount });
    }
  }

  test("Create a savings club", async () => {
    await contract.createGroup(addresses, names, 0); 

    const depositAmount = 100;
    await allAccountsDeposit(depositAmount);

    expect(await contract.getBalance(1)).to.equal(depositAmount * addresses.length);

    await contract.withdraw(depositAmount * addresses.length);

    expect(await contract.getBalance(1)).to.equal(0);
  });


});
