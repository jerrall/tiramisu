const { ethers } = require("hardhat");

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
const getAccounts = async (accountCount) => {
  const accounts = await ethers.getSigners();
  return accounts
    .slice(0, accountCount);
}

module.exports = {
    getAccounts
}