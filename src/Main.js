import React, { Component } from "react";
import CreateGroup from './components/CreateGroup';
import YourGroup from './components/YourGroup';
import ConnectWallet from './components/ConnectWallet';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { isWalletConnected, getGroupBalance, isMyTurn, isMemberOfGroup, isGroupOwner, whosTurnIsIt, 
  getMyName, registerCallbackForEvents, getCurrentWalletAddress } from "./services/ethereumService";

class Main extends Component {
  state = { };

  async componentDidMount() {
    this.updateState();
    registerCallbackForEvents(this.updateState);
  }

  updateState = async () => { 
    this.setState({
      isWalletConnected: isWalletConnected(),
      isMemberOfGroup:  await isMemberOfGroup(),
      isGroupOwner: await isGroupOwner(),
      isMyTurn: await isMyTurn(),
      groupBalance: await getGroupBalance(),
      whosTurnIsIt: await whosTurnIsIt(),
      myName: await getMyName(),
      currentWalletAddress: await getCurrentWalletAddress()
    }); 
  };
  
  render() {  
    const { isWalletConnected, isMemberOfGroup, isGroupOwner, isMyTurn, groupBalance, whosTurnIsIt, myName, currentWalletAddress } = this.state;
    
    return (
      <div style={{ textAlign: 'center', fontSize: '20px' }}>        
        { !isWalletConnected && <ConnectWallet /> }        
        { isWalletConnected && !isMemberOfGroup && <CreateGroup currentWalletAddress={currentWalletAddress}/> }       
        { isWalletConnected && isMemberOfGroup && 
            <YourGroup isOwnerOfGroup={isGroupOwner} isItMyTurn={isMyTurn} groupBalance={groupBalance} whosTurnIsIt={whosTurnIsIt} myName={myName}/>                          
        }  
        <ToastContainer position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover/>     
      </div>
    );
  }
}

export default Main;