import React, { Component } from "react";
import { createAndJoinGroup } from "../services/ethereumService";

class CreateGroup extends Component {
  state = {   
    groupNameText: '',
    amountText: '',
    nameText: ''
  };

  handleGroupNameChange = (e) => { this.setState( { groupNameText: e.target.value } ); };
  handleAmountChange = (e) => { this.setState( { amountText: e.target.value } ); };
  handleNameChange = (e) => { this.setState( { nameText: e.target.value } ); };
  handleCreateButton = () => { 
    const { groupNameText, amountText, nameText } = this.state;
    createAndJoinGroup( groupNameText, amountText, nameText );
  };

  render() {    
    return (
      <React.Fragment>
        <h2>Create New Group</h2>    
        New Group Name: <input type="text" onChange={ this.handleGroupNameChange } /><br /><br />
        Amount: <input type="text" onChange={ this.handleAmountChange } /><br /><br />
        Your Name: <input type="text" onChange={ this.handleNameChange } /><br /><br />
        <button type="button" onClick={ this.handleCreateButton }>Create and Contribute To New Group</button>
        <hr />
      </React.Fragment>
    );
  }
}

export default CreateGroup;
