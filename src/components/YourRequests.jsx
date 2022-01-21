import React, { Component } from "react";

class YourRequests extends Component {
  state = {   
  };

  render() {    
    const { requests } = this.props;

    return (
      <React.Fragment>
        <h2>Your Requests</h2>
          {requests && requests.map((request) => (
              <React.Fragment>
                <strong>{ request.groupName }</strong><br />
                Amount: { request.amount } ETH<br />
                Date/Time Requested: { request.dateRequested }<br />
                Reason: { request.reason }<br />
                Status: { request.status }<br />
                <br /><br />            
              </React.Fragment>
          ))}              
      </React.Fragment>
    );
  }
}

export default YourRequests;