import React, { Component } from "react";

class YourRequests extends Component {
  state = {   
  };

  render() {    
    return (
      <React.Fragment>
        <h2>Your Requests</h2>
        <strong>Group BBB</strong><br />
        Amount: 0.01 ETH<br />
        Date/Time Requested: 2022/01/14 12:00<br />
        Reason: Business Assistance<br />
        Status: Approved<br />
        <br /><br />

        <strong>Group AAA</strong><br />
        Amount: 0.05 ETH<br />
        Date/Time Requested: 2022/01/14 12:00<br />
        Reason: I need a new TV<br />
        Status: Denied<br />
        <br /><br />
      </React.Fragment>
    );
  }
}

export default YourRequests;