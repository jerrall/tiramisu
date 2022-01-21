import React, { Component } from "react";
import { approveRequest, denyRequest } from '../services/ethereumService';

class PendingRequests extends Component {
  render() {    
    const { requests } = this.props;

    return (
      <React.Fragment>
        <h2>Pending Requests</h2>
          {requests && requests.map((request) => (
              <React.Fragment>
                <strong>{ request.requestorName } - { request.groupName }</strong><br />
                Amount: { request.amount } ETH<br />
                Reason: { request.reason } <br />
                Date Requested: { request.dateRequested } <br />
                <button type="button" onClick={ () => { approveRequest(request.id) } }>Approve</button>
                <button type="button" onClick={ () => { denyRequest(request.id) }}>Deny</button>
                <br /><br />
              </React.Fragment>
          ))}         
        <hr />
      </React.Fragment>
    );
  }
}

export default PendingRequests;