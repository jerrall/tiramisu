import React, { Component } from "react";
import { isMetaMaskInstalled, attemptWalletConnect } from "../services/ethereumService";

class ConnectWallet extends Component {
  state = {   
    metaMaskInstalled: isMetaMaskInstalled(),  
    connectingToWallet: false
  };
  
  handleConnectWalletButton = () => {     
    attemptWalletConnect();
    this.setState({ connectingToWallet: true });
  };

  render() {    
    const { metaMaskInstalled, connectingToWallet} = this.state;
    return (
      
      <React.Fragment>
        <h1>Tiramisu Savings Club</h1>         
        { !metaMaskInstalled && <strong>MetaMask is not installed on your browser. Please visit <a href="https://metamask.io/" without rel="noreferrer" target="_blank">metamask.io</a> to download and install MetaMask.</strong>}
        {metaMaskInstalled && !connectingToWallet && <button onClick={ this.handleConnectWalletButton }>Connect to MetaMask Wallet</button>}
        { connectingToWallet && <strong>Connecting To Wallet...</strong> }        
      </React.Fragment>
    );
  }
}

export default ConnectWallet;
