# Beertalik Brokerin

Combination of memecoin trading and beer! Tool for event organisers to let customers trade beer. The more users purchase beer, the higher the prices rise. Beer purchases are stored on NFC-enabled wristband, making it easy to exchange digital tokens for actual beverages at events.

## Description

After logging into our app through Dynamic, users can browse and join various events.
Once inside an event, they’ll connect their NFC wristband and choose an ENS name as their username.

From there, users can explore dynamic price charts for all available drinks. Prices rise as more people buy a specific drink and gradually decrease over time.

Bartenders can easily scan the wristbands to view redeemable drinks and exchange them for real ones by burning the corresponding tokens from the user’s account.

## How its made

We use the Dynamic SDK to enable both wallet and social logins for users.
A smart contract manages and stores a list of all ongoing events. This smart contract is a factory and will deploy a event contract for any newly created event.

When users join an event, they call a function to link their NFC wristband and create an ENS subname.
The NFC wristband is a simple address to address mapping inside the smart contract.
Every event is its own ens subname each user has a subname for that event:

https://app.ens.domains/ethglobal-sf.beertalik.eth?tab=subnames

Currently the beer token is a simple ERC20 token for simplicity but can easily be exchanged for an ERC1155 when different kinds of drinks want to be added to the event.

The event merchant, as the owner of the event contract, can scan the NFC wristband to view the user’s ENS name and burn tokens from the user’s account during redemption.

Every purchase of beer emits the following event:

`event Purchase(address from, uint256 blockNumber, uint256 price);`

These events are getting indexed by The Graph to display a price chart on the app.

## Future Outlook

