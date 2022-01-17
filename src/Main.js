import React, { Component } from 'react';
import CreateGroup from './components/CreateGroup';
import SearchGroup from './components/SearchGroup';
import YourGroups from './components/YourGroups';
import PendingRequests from './components/PendingRequests';
import YourRequests from './components/YourRequests';
import { getMyGroups, getPendingRequests, getMyRequests } from "./services/ethereumService";

class Main extends Component {
  state = {   
    groups: getMyGroups(),
    pendingRequests: getPendingRequests(),
    myRequests: getMyRequests()
  };

  updateState(){
    this.setState({
      groups: getMyGroups(),
      pendingRequests: getPendingRequests(),
      myRequests: getMyRequests()
    });
  }

  render() {  
    const { groups, pendingRequests, myRequests } = this.state;
    
    return (
      <React.Fragment>        
        <CreateGroup />
        <SearchGroup />
        <YourGroups groups={ groups } />
        <PendingRequests requests={ pendingRequests } />
        <YourRequests requests={ myRequests } />
      </React.Fragment>
    );
  }
}

export default Main;