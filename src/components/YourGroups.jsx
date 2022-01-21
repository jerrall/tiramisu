import React, { Component } from "react";

class YourGroups extends Component {
  render() {    
    const { group } = this.props;

    return (
      <React.Fragment>
        <h2>Your Group</h2>                     
          <strong>{group.name}</strong><br />
          {group.amount} ETH Available
          <br /><br />
          Amount: <input type="text" /><br />
          <button type="button">Contribute Amount</button>
          <br /><br />  
          Amount: <input type="text" /><br />
          Reason: <input type="text" /><br />
          <button type="button">Request Amount</button>
          <br /><br />   
          { group.isOwner && <button type="button">Dissolve Group</button>}
          <br /><br /><br /><br />                      
        <hr />
      </React.Fragment>
    );
  }
}

export default YourGroups;