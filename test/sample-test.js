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

  test("Full round of deposits and withdrawals - golden path", async () => {
    const recurringDepositAmount = 100; // Each member should deposit this much per period
    const periodsToSimulate = accounts.length; // Pay periods equal to # of addresses to simulate the whole enchilada

    for (let i = 0; i < periodsToSimulate; i++) {
      await allAccountsDeposit(recurringDepositAmount); // Each account is honest and pays the exact amount they owe on time
      let nextPayeeIndex = await contract.nextPayee();
      let nextPayee = accounts[nextPayeeIndex];
  
      const withdrawalAmount = recurringDepositAmount * accounts.length;
      const balanceBefore = await contract.getBalance();
      await contract.connect(nextPayee).withdraw(withdrawalAmount);
      const balanceAfter = await contract.getBalance();
      expect(balanceBefore).to.equal(withdrawalAmount);
      expect(balanceAfter).to.equal(0);
    }

    // Confirm that nextPayee cycled back to 0 at the end (modulo behavior)
    expect(await contract.nextPayee()).to.equal(0);

    // Assuming everyone acted honestly, the difference between deposits and withdrawals for EACH user should be 0
    // b/c a savings club has no expectation of profits
    for (let account of accounts) {
      const totalDeposits = await contract.deposits(account.address);
      const totalWithdrawals = await contract.withdrawals(account.address);
      expect(totalDeposits - totalWithdrawals).to.equal(0);
    }
  });

  test("One user fails to deposit, payee fails to withdraw owed amount", async () => {
    const recurringDepositAmount = 100; // Each member should deposit this much per period

    // All users except the last user pay their dues on time - we expect sc account balance to be underfunded
    for (let i = 0; i < accounts.length - 1; i++) {
      await contract.connect(accounts[i]).deposit({ value: recurringDepositAmount });
    }

    let nextPayeeIndex = await contract.nextPayee();
    expect(nextPayeeIndex).to.equal(0);
    let nextPayee = accounts[nextPayeeIndex];

    const balanceBefore = await contract.getBalance();
    expect(balanceBefore).to.equal(recurringDepositAmount * (accounts.length - 1));

    // Should throw an exception, transaction should be reverted
    // Smart contract account is underfunded, can't actually withdrew expected amount
    async function fails() {
      await contract.connect(nextPayee).withdraw(recurringDepositAmount * accounts.length);
    }

    await expect(fails()).to.be.rejectedWith(Error, "Cannot withdraw more than the current balance");

    const balanceAfter = await contract.getBalance();
    expect(balanceAfter).to.equal(balanceBefore); // balance stays the same b/c transaction failed

    // Confirm that nextPayee was not incremented b/c transaction failed
    expect(await contract.nextPayee()).to.equal(nextPayeeIndex);

    // Payee might as well withdraw the remaining balance, even if it is less than they were owed
    await contract.connect(nextPayee).withdraw(balanceBefore);
    expect(await contract.getBalance()).to.equal(0); // smart contract account balance should be drained

    const payeeDeposits = await contract.deposits(nextPayee.address);
    const payeeWithdrawals = await contract.withdrawals(nextPayee.address);
    expect(payeeDeposits).to.equal(recurringDepositAmount); // Payee did their part, and paid their dues
    expect(payeeWithdrawals).to.equal(balanceBefore); // Payee received this much
    // This user's owed balance should be negative, even though they got screwed by the other member who didn't pay
    // Owed balance should be (-1) * (recurringDepositAmount * (accounts.length - 2))
    // 2 payments are missing, one because they got screwed by one of their peers and never got that portion of the payout
    // the other because this payee did pay their dues for this round
    expect(payeeDeposits - payeeWithdrawals).to.equal(-recurringDepositAmount * (accounts.length - 2)); // 2 parts missing, one from bad egg who didn't pay their 

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
