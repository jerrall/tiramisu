import React, { Component } from "react";
import { searchGroups, contributeAndJoinGroup } from '../services/ethereumService';

class SearchGroup extends Component {
  state = {   
    searchText: '',
    amountText: '',
    nameText: '',
    selectedGroup: ''    
  };

  handleSearchTextChange = (e) => { this.setState({ searchText: e.target.value }); };
  handleAmountTextChange = (e) => { this.setState({ amountText: e.target.value }); };
  handleNameTextChange = (e) => { this.setState({ nameText: e.target.value }); };
  handleGroupChange = (e) => { this.setState({ selectedGroup: e.target.value }); };

  performSearch = async () => { this.setState({ groups: await searchGroups(this.state.searchText) }); };

  contributeAndJoin = async () => { 
    const { selectedGroup, nameText , amountText } = this.state;
    await  contributeAndJoinGroup( selectedGroup, nameText, amountText); 
  };

  render() {    
    return (
      <React.Fragment>
        <h2>Search For, Contribute To, and Join Group</h2>
        Search: <input type="text" onChange={ this.handleSearchTextChange }/><br />
        <button type="button" onClick={ this.performSearch }>Search</button><br /><br />
        <select size="5" style={{ width: "300px" }} onChange={ this.handleGroupChange } >
          {this.state.groups && this.state.groups.map((group) => (
              <option id={group.id} key={group.id}>{group.name}</option>                          
          ))}   
        </select><br /><br />
        Amount: <input type="text" onChange={ this.handleAmountTextChange }/><br /><br />
        Your Name: <input type="text" onChange={ this.handleNameTextChange }/><br /><br />
        <button type="button" onClick={ this.contributeAndJoin }>Contribute Amount to Selected Group</button>
        <hr />
      </React.Fragment>
    );
  }
}

export default SearchGroup;
