What will be v2 of our dapp camp project look like?

## Scenarios - savings club organizer

As a savings club organizer, I want to be able to customize the way the payout ordering works at group creation time.
This could work by implementing different constructor strategies
- Ordering is specified by group creator (linear order agreed upon off chain)
- Ordering is verifiably random

As a savings club organizer, I want to be able to select the currency that is used for my club
- eth
- weth
- usdc
- other currencies?

As a savings club organizer, I want to be able to constrain the way withdrawals work
- Max withdrawal amount (per payee - so no one can just fully drain the contract on their turn)
- Time requirements
- Tracking penalties if time requirement not met

As a savings club organizer, I want to be able to constrain the way dissolutions work

As a savings club organizer, I want to have an easy to use contract deployment experience with the front end
- Clear and concise documentation
- UX flow that walks me through the tweaking and deployment phases
- Management page where I can view and modify the group after deployment

## Scenarios - savings club user

As a savings club user, I want to be able to view details about my savings club
- Payout order
- When it is my turn to get paid out
- What my contribution obligations are (and what happens if I don't follow through)
- Currency denomination
- List of peer member addresses

As a savings club user, I want to be able to view deposit history for the savings club

As a savings club user, I want to be able to click on the address of a peer and view their deposit history

As a savings club user, I want to be able to vote to dissolve the savings club and disburse funds
- Escape hatch that can override a group owner if a super majority votes to allow it

As a savings club user, I want the fund disbursement to be predictable and well communicated (I understand that I'm not guaranteed to receive a full refund)

## Dissolve support

Our contract should have a coherent dissolve strategy that can be initiated by the group owner or by a super majority vote.

- For each address:
    - Owed balance = sum of all deposits - sum of all withdrawals (calculated from mappings in storage)
    - If owed balance = 0, this address is settled
    - If owed balance < 0, this address actually owes the protocol $ and is currently a liability to other users
    - If owed balance > 0, the protocol owes this user
Allocate remaining funds to addresses where owed balance > 0, weighted by how much is owed to them
This formula works because a savings group is in theory a closed system, with no expectation of profit
Ideally, the amount of $ you deposited, is the exact same amount you should get back at the end
If that's not true, then something went wrong.

## ERC-20 support

Instead of only supporting native ether, we should rearchitect the smart contract so that it can support ERC 20 tokens
This way, a group creator can specify an ERC-20 token address that the contract will use for deposits and withdrawals

## ENS support

At group creation time, I can enter an ENS name instead of an address
- The frontend will do user input validation and make sure the input is a valid address or a valid ENS name
- On submission for an ENS name, the frontend will namehash the ENS name into a bytes32 value that gets stored in the contract
- On submission for an address, the front will rightpad the address with 12 null bytes so it can be stored alongside bytes32 ENS namehashed values

At group creation time, I can enter an address and the frontend will try to reverse resolve it. If it can be reverse resolved, the frontend will show the ENS name

## Architecture

The single contract architecture was convenient and has advantages for analytics
But there is still something to be said for a smart contract factory architecture

Pros
- Flexibility. Anyone could deploy their own smart contract from our template and register it with the factory contract and manage it through our frontend as long as it defines the same basic interface (which we could publish)
- It's easier to upgrade a simple smart contract factory since it is (mostly) stateless. The only state it needs to manage is a list of sub contract addresses
- The business logic for the smart contract factory can be pretty elegant and simple.
- The implementation strategies can be versioned. We could provide multiple implementations of the same interface and the user can pick the one they want.
- Segmenting liquidity (reduce hack attack surface area)

Cons
- Analytics get more complicated and possibly untenable. 
- User has to pay the gas costs for deploying their own smart contracts
- Either user has to remember their contract address, or the frontend has to go searching for their contract by iterating over all known contracts