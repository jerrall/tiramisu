

export async function searchGroups(searchCriteria){
    //return groupID, Group Name - return random results for now    
    let numResults = Math.floor(Math.random() * 10);
    let ret = [];
    for(let i = 0; i < numResults; i++){
        ret.push({
            id: i,
            name: ('group: ' + searchCriteria + " " + i)
        });
    }
    return ret;
}

export async function createAndJoinGroup(groupName, amount,  name){
    alert("Creating Group: " + groupName + " Name: " + name + " Amount: " + amount);
}

export async function contributeAndJoin(groupId, name, amount){
    alert("Joining Group: " + groupId + " Name: " + name + " Amount: " + amount);
}

export function getMyGroups(){
    //return groupID, Group Name, Amount of Funds - return random results for now
    let numResults = Math.floor(Math.random() * 10);
    let ret = [];
    for(let i = 0; i < numResults; i++){
        ret.push({
            id: i,
            name: ('group: ' + i),
            amount: (i + 100)
        });
    }
    return ret;
}

export function getPendingRequests(){
    return null;
}

export function getMyRequests(){
    return null;
}

export function registerCallbackForEvents(callback){
    //for now, just use an interval timer
    

}



