import "./styles.css";
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
          <p>Hello <strong>{myName}!</strong></p>
                   
          <p>There is <strong>{groupBalance} ETH</strong> Available for Withdrawal</p>
         
          <div className="ui-section-divider">
            <p><strong>Deposit Funds</strong></p>
            <p>Amount: <input type="text" onChange={ this.handleDepositAmountChange }/></p>
            <button type="button" className="btn btn-primary btn-md" onClick={ this.handleDepositButton }>Deposit Amount</button>
          </div>

          <div className="ui-section-divider">
          <p><strong>Withdraw Funds</strong><br /></p>
            {!isItMyTurn && <p>It is <strong>{whosTurnIsIt}'s</strong> turn to withdraw funds.</p> }          

            {isItMyTurn && <React.Fragment><p>Amount: <input type="text" onChange={ this.handleWithdrawAmountChange }/></p>         
            <button type="button" className="btn btn-primary btn-md" onClick={ this.handleWithdrawButton }>Withdraw Amount</button></React.Fragment> }
          </div>
          
          { isOwnerOfGroup && <div><button type="button" className="btn btn-primary btn-md" onClick={ this.handleDissolveButton }>Dissolve Group</button></div>}
      </React.Fragment>
    );
  }
}

export default YourGroup;