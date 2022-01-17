const { expect, use } = require("chai");
const { describe, test } = require("mocha");
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");

// augment missing functionality in chai, helpful for dealing with async operations
use(chaiAsPromised);

/**
 * Fetch the first accountCount accounts from hardhat
 * 
 * WARNING:
 *  - These accounts are deterministically the same for all users
 *  - Private keys are publicly available, and not safe
 *  - Useful for testing only
 *  - Go here for more information: https://hardhat.org/getting-started/#running-tasks
 * @param {number} accountCount 
 * @returns {any[]} list of addresses
 */
 async function getAccounts(accountCount) {
  const accounts = await ethers.getSigners();
  return accounts
    .slice(0, accountCount);
}

describe("Tiramisu savings club", () => {
  const NUM_TEST_ACCOUNTS = 10;
  let accounts; // list of NUM_TEST_ACCOUNTS accounts
  let addresses; // list of NUM_TEST_ACCOUNTS addresses

  let contract; // deployed contract object

  // runs once before the first test in this block
  // eslint-disable-next-line no-undef 
  before(async () => {
    // Generate 10 test accounts deterministically from hardhat
    accounts = await getAccounts(NUM_TEST_ACCOUNTS);

    // Map this list of accounts to a list of addresses for convenience
    addresses = accounts.map(account => account.address);
  });

  // `beforeEach` will run before each test, re-deploying the contract every time
  beforeEach(async () => {
    const factory = await ethers.getContractFactory("TiramisuExperiment");
    contract = await factory.deploy(addresses);
  
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

  test("All accounts deposit and first account withdraws max", async () => {
    await allAccountsDeposit(100);  

    const expectedBalance = accounts.length * 100;
    expect(await contract.getBalance()).to.equal(expectedBalance);

    await contract.connect(accounts[0]).withdraw(expectedBalance);

    expect(await contract.getBalance()).to.equal(0);
  });

  test("All accounts deposit and first account fails to overdraft the account", async () => {
    await allAccountsDeposit(100);  

    const expectedBalance = accounts.length * 100;
    const actualBalance = await contract.getBalance();
    expect(actualBalance).to.equal(expectedBalance);

    // Should throw an exception, transaction should be reverted
    async function fails() {
      await contract.connect(accounts[0]).withdraw(actualBalance + 1);
    }

    await expect(fails()).to.be.rejectedWith(Error, "Cannot withdraw more than the current balance");

    // Confirm full balance is still intact 
    expect(await contract.getBalance()).to.equal(expectedBalance);
  });


});
