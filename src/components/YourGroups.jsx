import React, { Component } from "react";

class YourGroups extends Component {
  state = {   
  };

  render() {    
    return (
      <React.Fragment>
        <h2>Your Groups</h2>
    
        <strong>Group AAA</strong><br />
        1.2345 ETH Available
        <br /><br />
        Amount: <input type="text" /><br />
        <button type="button">Contribute Amount</button>
        <br /><br />  
        Amount: <input type="text" /><br />
        Reason: <input type="text" /><br />
        <button type="button">Request Amount</button>
        <br /><br />   
        <button type="button">Dissolve Group</button>
        <br /><br /><br /><br /> 

        <strong>Group BBB</strong><br />
        2.347 ETH Available
        <br /><br />
        Amount: <input type="text" /><br />
        <button type="button">Contribute Amount</button>
        <br /><br />  
        Amount: <input type="text" /><br />
        Reason: <input type="text" /><br />
        <button type="button">Request Amount</button>
        <br /><br /><br /><br /> 

        <hr />
      </React.Fragment>
    );
  }
}

export default YourGroups;