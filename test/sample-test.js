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
    const factory = await ethers.getContractFactory("TiramisuFactoryStrategy");
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
