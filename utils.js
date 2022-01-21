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

/**
 * Given a group, get the base 10 representation of the group balance
 * @param {string} base16Number A string representing a base 16 number 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
 * @returns base 10 number || NaN in case of invalid input
 */
const toBase10 = (base16Number) => parseInt(base16Number, 16)


module.exports = {
    getAccounts,
    toBase10
}