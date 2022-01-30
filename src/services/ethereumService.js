import { ethers } from 'ethers'
import { showToastMsg } from './toastService';
import TiramisuSavingsClub from '../artifacts/contracts/TiramisuSavingsClub.sol/TiramisuSavingsClub.json'
import Deployments from '../deployments.json';

const TiramisuAddress = Deployments.rinkeby[Deployments.rinkeby.length - 1].address;
const consoleLoggingEnabled = true;

/**************************************** METAMASK WALLET CALLS *************************************************/

let provider;
let signer;
let contract;
let currentWallet;
let currentChain;
let callback;

export function isMetaMaskInstalled(){    
    const { ethereum } = window;
    return (ethereum && ethereum.isMetaMask);
}

export function isWalletConnected(){
    return !!currentWallet;    
}

export function isConnectedToSupportedNetwork(){
    return !currentChain;
}

//attemptWalletConnect() should be successfully called first before this function is called

/**
 * Get human readable wallet address
 * - WARNING: attemptWalletConnect() should be successfully called first before this function is called
 * - WARNING: This does not guarantee an Ethereum address. This might return an ENS name
 * @returns {string} ENS name from reverse lookup OR Ethereum address
 */
export async function getCurrentWalletAddress(){
    if(!signer) return null;
    
    const address = await signer.getAddress();
    let ensName = null;
    if (provider) {
        ensName = await provider.lookupAddress(address);
    }
    const result = ensName === null ? address : ensName;
    debugger;
    return result;
}

if(window.ethereum){
    window.ethereum.on('accountsChanged', function (accounts) {
        debugLog("MetaMask Wallet Changed");
        if(callback) callback();
    });

    window.ethereum.on('disconnect', function (accounts) {
        debugLog("MetaMask Disconnected");
        currentWallet = null;
        if(callback) callback();
    });

    window.ethereum.on('chainChanged', function (accounts) {
        debugLog("MetaMask Chain Changed");    
        if(callback) callback();
    });
}

export async function attemptWalletConnect(){    
    try {               
        await window.ethereum.request({ method: 'eth_requestAccounts' });        
        provider = new ethers.providers.Web3Provider(window.ethereum);        
        signer = provider.getSigner();
        const { chainId } = await provider.getNetwork();
        currentChain = chainId;
        currentWallet = await signer.getAddress();                
        contract = new ethers.Contract(TiramisuAddress, TiramisuSavingsClub.abi, signer);  
        setContractEventHandlers();      
        console.log("Wallet Address: " + currentWallet);
        console.log("Chain ID: " + currentChain);                         
        if(callback) callback();
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function setContractEventHandlers(){
    contract.on("NewGroup", (addresses, names, ownerIndex) => { handleNewGroupEvent(addresses, names, ownerIndex); });
    contract.on("Deposit", (groupId, amount, sender, senderName, newGroupBalance) => { handleDepositEvent(groupId, amount, sender, senderName, newGroupBalance); });
    contract.on("Withdraw", (groupId, amount, recipient, recipientName, newGroupBalance) => {handleWithdrawEvent(groupId, amount, recipient, recipientName, newGroupBalance); });
    contract.on("Dissolve", (groupId, owner, ownerName) => { handleDissolveEvent(groupId, owner, ownerName); });
}

/**************************************** WRITE CALLS *************************************************/

export async function createGroup(addresses, names,  index){
    if (!isWalletConnected()) return undefined;

    try {            
        //let newAddresses = ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        //'0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc'];
        //let newNames = ['Bill','Jane'];
        const data = await contract.createGroup(addresses, names, index);
        debugLog('data: ', data);        
        return data;
    } catch (err) {
        console.error("Error: ", err)
        return false;
    }    
}

export async function deposit(amount){
    if (!isWalletConnected()) return undefined;

    try {                
        const data = await contract.deposit({value: ethers.utils.parseEther(amount)});
        debugLog('data: ', data);            
        return data;
    } catch (err) {
        console.error("Error: ", err)
        return false;
    }   
}

export async function withdraw(amount){
    if (!isWalletConnected()) return undefined;

    try {                
        const data = await contract.withdraw(ethers.utils.parseEther(amount));
        debugLog('data: ', data);            
        return data;
    } catch (err) {
        console.error("Error: ", err);
        return false;
    }   
}

export async function dissolve(){
    if (!isWalletConnected()) return undefined;

    try {                
        const data = await contract.dissolve();
        debugLog('data: ', data);            
        return data;
    } catch (err) {
        console.error("Error: ", err);
        return false;
    }   
}

/**************************************** READ CALLS *************************************************/

async function genericReadCall(call, returnOnError){
    if (!isWalletConnected()) return false;

    try {
        const data = await call();
        debugLog('data: ', data);     
        return data;
    } catch (err) {
        console.error("Error: ", err)
        return returnOnError;
    }    
}

export async function isMemberOfGroup(){
    if(!contract) return false;
    return await genericReadCall(contract.isMemberOfGroup, false);    
}

export async function isGroupOwner(){
    if(!contract) return false;
    return await genericReadCall(contract.isGroupOwner, false); 
}

export async function isMyTurn(){
    if(!contract) return false;
    return await genericReadCall(contract.isMyTurn, false); 
}

export async function whosTurnIsIt(){
    if(!contract) return false;
    return await genericReadCall(contract.whosTurnIsIt, ""); 
}

export async function getGroupBalance(){
    if(!contract) return false;
    let ret = await genericReadCall(contract.getGroupBalance, 0); 
    return ethers.utils.formatEther(ret);
}

export async function getMyName(){
    if(!contract) return false;
    return await genericReadCall(contract.getMyName, ""); 
}

/**************************************** EVENT HANDLERS *************************************************/

function handleNewGroupEvent(addresses, names, ownerIndex){
    debugLog("New Group Event Received", 
        "Addresses:", addresses,
        "Names:", names, 
        "Owner Index:", ownerIndex);
    showToastMsg(names[ownerIndex] + " Started a New Group!");
    if(callback) callback();
}

function handleDepositEvent(groupId, amount, sender, senderName, newGroupBalance){
    const groupIDTxt = groupId.toString();
    const amountInEth = ethers.utils.formatEther(amount);
    const groupBalanceInEth = ethers.utils.formatEther(newGroupBalance);

    debugLog("Deposit Event Received", 
        "GroupID:", groupIDTxt, 
        "Amount:", amountInEth,
        "Sender:", sender, 
        "Sender Name:", senderName,
        "New Group Balance:", groupBalanceInEth);

    showToastMsg(senderName + " Deposited " + amountInEth + " ETH");  
    showToastMsg("Group Balance is Now: " + groupBalanceInEth + " ETH");       
    if(callback) callback();
}

function handleWithdrawEvent(groupId, amount, recipient, recipientName, newGroupBalance){
    const groupIDTxt = groupId.toString();
    const amountInEth = ethers.utils.formatEther(amount);
    const groupBalanceInEth = ethers.utils.formatEther(newGroupBalance);
   
    debugLog("Withdraw Event Received", 
        "GroupID:", groupIDTxt, 
        "Amount:", amountInEth,
        "Recipient:", recipient, 
        "Recipient Name:", recipientName,
        "New Group Balance:", groupBalanceInEth);

    showToastMsg(recipientName + " Withdrew " + amountInEth + " ETH");  
    showToastMsg("Group Balance is Now: " + groupBalanceInEth + " ETH");     
    if(callback) callback();
}

function handleDissolveEvent(groupId, owner, ownerName){
    debugLog("Dissolve Event Received", 
        "Group ID:", groupId.toString(),
        "Owner:", owner,
        "Owner Name:", ownerName);

    showToastMsg(ownerName + " Dissolved his/her Group"); 
    if(callback) callback();
}

/**************************************** CALLBACK *************************************************/

export function registerCallbackForEvents(_callback){
    callback = _callback;    
    setInterval(callback, 60000); //refresh every minute, regardless of what happens
}

/**************************************** LOGGING *************************************************/

function debugLog(){
    if(consoleLoggingEnabled) console.log.apply(null, arguments);
}

