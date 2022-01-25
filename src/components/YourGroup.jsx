import React, { Component } from "react";
import { withdraw, deposit, dissolve } from "../services/ethereumService";

class YourGroup extends Component {
  state = {   
    depositAmountText: '',
    withdrawAmountText: '',   
  };

  handleDepositAmountChange = (e) => { this.setState( { depositAmountText: e.target.value } ); };
  handleWithdrawAmountChange = (e) => { this.setState( { withdrawAmountText: e.target.value } ); };  
  handleDepositButton = () => { deposit(this.state.depositAmountText); };
  handleWithdrawButton = () => { withdraw(this.state.withdrawAmountText); };
  handleDissolveButton = () => { dissolve(); };

  render() {        
    const { isOwnerOfGroup, isItMyTurn, groupBalance, whosTurnIsIt, myName } = this.props;    

    return (
      <React.Fragment>
        <h2>Your Group</h2>                             
          Hello <strong>{myName}!</strong>
          <br /><br />
          
          There is <strong>{groupBalance} ETH</strong> Available for Withdrawal
          <br /><br />

          <strong>Deposit Funds</strong><br/>
          Amount: <input type="text" onChange={ this.handleDepositAmountChange }/><br />
          <button type="button" onClick={ this.handleDepositButton }>Deposit Amount</button>
          <br /><br />  

          <strong>Withdraw Funds</strong><br />
          {!isItMyTurn && <React.Fragment>It is <strong>{whosTurnIsIt}'s</strong> turn to withdraw funds.</React.Fragment> }

          {isItMyTurn && <React.Fragment>Amount: <input type="text" onChange={ this.handleWithdrawAmountChange }/><br />         
          <button type="button" onClick={ this.handleWithdrawButton }>Withdraw Amount</button></React.Fragment> }
          <br /><br />   
          
          { isOwnerOfGroup && <button type="button" onClick={ this.handleDissolveButton }>Dissolve Group</button>}                          
      </React.Fragment>
    );
  }
}

export default YourGroup;