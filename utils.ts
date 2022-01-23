import { BigNumber } from "ethers";
import { ethers } from "hardhat";

/**
 * Fetch the first accountCount accounts from hardhat
 * 
 * WARNING:
 *  - These accounts are deterministically the same for all users
 *  - Private keys are publicly available, and not safe
 *  - Useful for testing only
 *  - Go here for more information: https://hardhat.org/getting-started/#running-tasks
 */
export const getAccounts = async (accountCount: number) => {
  const accounts = await ethers.getSigners();
  return accounts
    .slice(0, accountCount);
}

/**
 * Given a group, get the base 10 representation of the group balance
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
 */
export const toBase10 = (bigNumber: BigNumber) => parseInt(bigNumber["_hex"], 16)
