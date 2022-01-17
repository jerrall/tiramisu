import React, { Component } from "react";

class PendingRequests extends Component {
  state = {   
  };

  render() {    
    return (
      <React.Fragment>
        <h2>Pending Requests</h2>
        <strong>Joe Smith - Group AAA</strong><br />
        Amount: 0.1 ETH<br />
        Reason: Emergency Medical Expense<br />
        <button type="button">Approve</button>
        <button type="button">Deny</button>
        <br /><br />

        <strong>John Doe - Group BBB</strong><br />
        Amount: 0.01 ETH<br />
        Reason: Emergency Home Expense<br />
        <button type="button">Approve</button>
        <button type="button">Deny</button>
        <br /><br />

        <hr />
      </React.Fragment>
    );
  }
}

export default PendingRequests;