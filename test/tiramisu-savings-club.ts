import { expect, use } from "chai";
import { describe, test } from "mocha";
import { ethers } from "hardhat";
import chaiAsPromised from "chai-as-promised";
import { getAccounts, toBase10 } from "../utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { TiramisuSavingsClub } from "../typechain"

// augment missing functionality in chai, helpful for dealing with async operations
use(chaiAsPromised);

describe("Tiramisu savings club", () => {
    const NUM_TEST_ACCOUNTS = 10;
    let accounts: SignerWithAddress[]; // list of NUM_TEST_ACCOUNTS accounts
    let addresses: string[]; // list of NUM_TEST_ACCOUNTS addresses
    let names: string[]; // Placeholder for human readable names, using UPPERCASE of address for now

    let contract: TiramisuSavingsClub; // deployed contract object

    // runs once before the first test in this block
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
    const allAccountsDeposit = async (amount: number) => {
        // Each account deposits same amount of wei
        for (let i = 0; i < accounts.length; i++) {
            await contract.connect(accounts[i]).deposit({ value: amount });
        }
    }

    /**
     * Fetch a group by id from the contract
     * Converts the ethers.js group struct into a more friendly plain old JS object
     * @param {number} groupId to fetch group at
     * @returns JS friendly group object
     */
    const getGroup = async (groupId: number) => {
        const group = await contract.getGroup(groupId);
        return {
            ...group,
            ownerIndex: toBase10(group.ownerIndex),
            balance: toBase10(group.balance),
            nextPayee: toBase10(group.nextPayee)
        };
    }

    describe("createGroup", function () {
        it("should revert when creating an empty group", async function () {
            await expect(
                contract.connect(accounts[0]).createGroup([], [], 0)
            ).to.be.revertedWith("Cannot create an empty group");
        });

        it("should revert when _members and _names length does not match", async function () {
            await expect(
                contract.connect(accounts[0]).createGroup(addresses, names.slice(1), 0)
            ).to.be.revertedWith("_members and _names length should match");
        });

        it("should revert when _owner index is invalid", async function () {
            await expect(
                contract.connect(accounts[0]).createGroup(addresses, names, addresses.length)
            ).to.be.revertedWith("_owner index invalid");
        });

        it("should revert when address already belongs to a group", async function () {
            await contract.createGroup(addresses, names, 0);

            await expect(
                contract.connect(accounts[1]).createGroup(addresses, names, 0)
            ).to.be.revertedWith("Failed to create a group, because an address already belongs to a group");
        });
    });

    describe("deposit", function () {
        it("should revert when deposit amount is not greater than zero", async function () {
            await expect(
                contract.connect(accounts[0]).deposit({ value: 0 })
            ).to.be.revertedWith("Deposit amount must be greater than zero");
        });

        it("should increase group balance by message value when valid amount is provided", async function () {
            await contract.createGroup(addresses, names, 0);

            let group1 = await getGroup(1);
            const originalbalance = group1.balance;

            await contract.connect(accounts[0]).deposit({ value: 100 });

            group1 = await getGroup(1);
            const laterBalance = group1.balance;

            expect(laterBalance).to.equal(originalbalance + 100);
        });

        test("Basic create, deposit, withdraw, and dissolve", async () => {
            await contract.createGroup(addresses, names, 0); 
        
            const depositAmount = 100;
            await expect(contract.connect(accounts[0]).deposit({ value: depositAmount * addresses.length }))
                .to.emit(contract, "DepositEvent")
                .withArgs(1, depositAmount * addresses.length, addresses[0],  addresses[0].toUpperCase(), depositAmount * addresses.length);
            
            let group = await getGroup(1);
            expect(group.members.length).to.equal(addresses.length);
            expect(group.balance).to.equal(depositAmount * addresses.length);
        
            await expect(contract.withdraw(depositAmount * addresses.length))
                .to.emit(contract, "WithdrawEvent")
                .withArgs(1, depositAmount * addresses.length, addresses[0], addresses[0].toUpperCase(), 0);
            
            group = await getGroup(1);
            expect(group.balance).to.equal(0);
        
            await contract.dissolve();
            group = await getGroup(1);
            expect(group.members.length).to.equal(0);
          });
    });

    describe("withdraw", function () {
        it("should revert when withdrawal amount is not positive", async function () {
            await expect(
                contract.connect(accounts[0]).withdraw(0)
            ).to.be.revertedWith("Withdrawal amount must be positive");
        });

        it("should revert when withdrawal amount is greater than group's balance", async function () {
            await contract.createGroup(addresses, names, 0);
            await contract.deposit({ value: 10000 });

            await expect(
                contract.connect(accounts[0]).withdraw(11000)
            ).to.be.revertedWith("Cannot withdraw more than the current balance");
        });

        it("should revert when caller is not the next payee", async function () {
            await contract.createGroup(addresses, names, 0);
            await contract.deposit({ value: 10000 });
            await contract.connect(accounts[0]).withdraw(5000);

            await expect(
                contract.connect(accounts[0]).withdraw(1000)
            ).to.be.revertedWith("Caller is not the next payee");
        });

        it("should decrease group balance by message value when valid amount is provided", async function () {
            await contract.createGroup(addresses, names, 0);
            await contract.deposit({ value: 10000 });

            let originalbalance = (await getGroup(1)).balance;
            await contract
                .connect(accounts[0])
                .withdraw(5000);

            let laterbalance = (await getGroup(1)).balance;
            expect(laterbalance).to.equal(originalbalance - 5000);
        });

        it("should change the payee to the next member", async function () {
            await contract.createGroup(addresses, names, 0);
            await contract.deposit({ value: 10000 });
            await contract
                .connect(accounts[0])
                .withdraw(5000);

            const group1 = await getGroup(1);
            expect(group1.nextPayee).to.equal(1);
        });
    });

    describe("dissolve", function () {
        it("should revert when caller is not the group owner", async function () {
            await contract.createGroup(addresses, names, 1);

            await expect(
                contract.connect(accounts[0]).dissolve()
            ).to.be.revertedWith("Caller is not the group owner");
        });

        it("delete group information", async function () {
            await contract.createGroup(addresses, names, 0);
            await contract.connect(accounts[0]).dissolve();

            const group = await getGroup(1);
            expect(group.members.length).to.equal(0);
        })
    })
});