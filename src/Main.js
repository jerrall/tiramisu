import React, { Component } from 'react';
import CreateGroup from './components/CreateGroup';
import SearchGroup from './components/SearchGroup';
import YourGroups from './components/YourGroups';
import PendingRequests from './components/PendingRequests';
import { getMyGroup, registerCallbackForEvents } from "./services/ethereumService";

class Main extends Component {
  state = { };

  async componentDidMount() {
    this.updateState();
    registerCallbackForEvents(this.updateState);
  }

  updateState = async () => { 
    this.setState({
      group: await getMyGroup(),     
    }); 
  };
  
  render() {  
    const { group } = this.state;
    
    return (
      <React.Fragment>        
        { group == null && <CreateGroup />}
        { group == null && <SearchGroup />}
        { group && <YourGroups group={group} /> }
        { group && <PendingRequests group={group} /> }
      </React.Fragment>
    );
  }
}

export default Main;