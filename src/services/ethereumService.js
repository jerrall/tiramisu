export async function createAndJoinGroup(groupName, amount,  name){
    alert("Creating Group: " + groupName + " Name: " + name + " Amount: " + amount);
}

export async function contributeAndJoinGroup(groupId, name, amount){
    alert("Joining Group: " + groupId + " Name: " + name + " Amount: " + amount);
}

export async function contribute(amount){
    alert("Contributing: " + amount);
}

export async function requesting(amount, reason){
    alert("Requesting Amount: " + amount + " For Reason: " + reason);
}

export async function dissolveGroup(){
    alert("Dissolving Group");
}

export async function approveRequest(){
    alert("Approving Request");
}

export async function denyRequest(){
    alert("Denying Request");
}

export async function searchGroups(searchCriteria){
    //return groupID, Group Name - return random results for now    
    let numResults = Math.floor(Math.random() * 3);
    let ret = [];
    for(let i = 0; i < numResults; i++){
        ret.push({
            id: i,
            name: ('group: ' + searchCriteria + " " + i)
        });
    }
    return ret;
}

export async function getMyGroup(){
    //return null;

    //return groupID, Group Name, Amount of Funds, Is Owner - return random results for now   
    return {
        id: 1234,
        name: ('group: ' + 1234),
        amount: (1234 + 100),
        isOwner: true,
        requestorName: "Requestor",
        requestorAmount: 0.1,
        dateRequested: "2012-04-23T18:25:43.511Z",
        reason: "Medical Emergency"
    };
}


/* leave this for now
export async function getMyPreviousRequests(){ //this will read the events
    //return Request ID, Group ID, Group Name, Amount, Reason, Date Created
    let numResults = Math.floor(Math.random() * 3);
    let ret = [];
    for(let i = 0; i < numResults; i++){
        ret.push({           
            dateRequested: "2012-04-23T18:25:43.511Z",
            amount: 123.45,
            reason: ("reason: " + i),
            status: "approved"
        });
    }
    return ret;   
}
*/

export function registerCallbackForEvents(callback){
    //for now, just use an interval timer
    setInterval(callback, 5000);
}



