import React, { Component } from "react";
import { createGroup } from "../services/ethereumService";

class CreateGroup extends Component {
  state = {
    names: ['','','',''],
    addresses: [this.props.currentWalletAddress,'','',''],
    ownerPosition: 0
  }
  
  handleNameChange = (index, e) => {     
    const newNames = [...this.state.names];
    newNames[index] = e.target.value;
    this.setState( { names: newNames } ); 
  };


  handleAddressChange = (index, e) => { 
    const newAddresses = [...this.state.addresses];
    newAddresses[index] = e.target.value;
    this.setState( { addresses: newAddresses } );    
  };

  handlePositionChange = (e) => { this.setState( { ownerPosition: e.target.value } ); };

  handleCreateButton = () => { 
    const { names, addresses, ownerPosition } = this.state;

    const finalNames = [];
    const finalAddrs = [];

    for(let i = 1; i < 4; i++){
      if(names[i].trim().length !== 0 && addresses[i].trim().length !== 0){        
        finalNames.push(names[i].trim());
        finalAddrs.push(addresses[i].trim());
      }
    }
    finalNames.splice(ownerPosition, 0, names[0].trim());
    finalAddrs.splice(ownerPosition, 0, addresses[0].trim()); 
  
    createGroup( finalAddrs, finalNames, ownerPosition );
  };

  render() {     
    const { currentWalletAddress } = this.props;
    
    return (
      <React.Fragment>
        <h2>Create New Group</h2>    
        You Are Not Yet A Member of a Group<br />
        Create One Here (Up To 4 Members Including the Group Owner)<br /><br />

        Group Owner<br />
        Name: <input type="text" onChange={ (e) => this.handleNameChange(0, e) } /><br />
        Address: <input type="text" onChange={ (e) => this.handleAddressChange(0, e) } disabled value={ currentWalletAddress }/><br /> 
        Position: <select name="ownerIndex" id="ownerIndex" onChange={ this.handlePositionChange} >
                      <option value="0">1</option>
                      <option value="1">2</option>
                      <option value="2">3</option>
                      <option value="3">4</option>
                </select>
        <br /><br />

        Member 1<br />
        Name: <input type="text" onChange={ (e) => this.handleNameChange(1, e) } /><br />
        Address: <input type="text" onChange={ (e) => this.handleAddressChange(1, e)  } /><br /> 
        <br /><br />

        Member 2<br />
        Name: <input type="text" onChange={ (e) => this.handleNameChange(2, e) } /><br />
        Address: <input type="text" onChange={ (e) => this.handleAddressChange(2, e)  } /><br /> 
        <br /><br />

        Member 3<br />
        Name: <input type="text" onChange={ (e) => this.handleNameChange(3, e) } /><br />
        Address: <input type="text" onChange={ (e) => this.handleAddressChange(3, e)  } /><br /> 
        <br /><br />
       
        <button type="button" onClick={ this.handleCreateButton }>Create New Group</button>        
      </React.Fragment>
    );
  }
}

export default CreateGroup;
