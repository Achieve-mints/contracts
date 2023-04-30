# Achieve-Mints

An upgradeable contract system for SoulBound tokens.

## Notes

ProxyAdmin needs to be transferred

We use AccessControl roles so that only valid/working admins can be added...
IE workflow:

- existing admin adds new admin
- new admin removes past admin

In case new admin is unable to remove past admin, old admin may remove new admin.

Hardhat deploy is not used because of:
https://github.com/wighawag/hardhat-deploy/pull/358/files

## Dev

```
npx hardhat node
npx hardhat run --network localhost scripts/001-deploy-soulbound-base.ts
```

To get proxy address:

`cat .openzeppelin/unknown-31337.json | jq -r ".proxies[-1].address"`

Modify the subtoken deployment scripts appropriately, then run:

```
npx hardhat run --network localhost scripts/002-deploy-example-subtoken.ts
npx hardhat run --network localhost scripts/003-deploy-avaxsummit2023token-subtoken.ts
```

## Deploy

### Environment Variables

In `.env` (copy from `.env.example`) you can configure your environment variables. These are read by `./utils/config.ts`.

### Actual Deployment

Deploy to fuji with the following command:

```
npx hardhat run --network fuji scripts/001-deploy-soulbound-base.ts
```

To get proxy address:

`cat .openzeppelin/avalanche-fuji.json | jq -r ".proxies[-1].address"`

Then run additional deploy scripts (after modifying them using the proxy address):

```
npx hardhat run --network fuji scripts/003-deploy-avaxsummit2023token-subtoken.ts
```

### Verification on SnowTrace

Read `.openzeppelin/NETWORK.json` and get the address for the implementation contract

Then verify using:

```
npx hardhat verify SOULBOUND_BASE_IMPLEMENTATION_ADDRESS --network fuji
```

Next verify the example contract using:


```
npx hardhat verify EXAMPLE_ADDRESS SOULBOUND_BASE_PROXY_ADDRESS --network fuji
```

Finally, go to snowtrace and view SOULBOUND_BASE_IMPLEMENTATION_ADDRESS, and click "More options" to enable Proxy view for the contract.


## Commands

- `yarn clean:contracts` perform hardhat cleaning
- `yarn build` clears cache and compiles smart contracts
- `yarn build:docs` builds developer documentation using docgen
- `yarn test [test file(s)]` runs the unit tests specified
- `yarn size` reports the size of your compiled smart contracts in KB
- `yarn prettier:check` checks for prettier issues
- `yarn prettier:lint` fixes prettier issues
- `yarn coverage` runs solidity-coverage, make sure to stop the hardhat node process first

### Tasks

Additional tasks can be added easily in `./tasks/index.ts` 

#### Check if subtoken is enabled

- `npx hardhat --network fuji base:subtoken:enabled --base BASE_PROXY --subtoken SUBTOKEN_ADDRESS`

#### Look up metadata:

- `npx hardhat --network fuji nft:metadata --base BASE_PROXY --id 1`

### Static Analysis

To install slither:

```
python3 -m venv venv # must be at least 3.8
pip install -r requirements.txt
source venv/bin/activate
```

Then to run:

```
slither .
```

More documentation can be found here: https://github.com/crytic/slither


### Deployed Contracts

#### io

* SoulBoundBaseToken `0xa6421E906a749B357Da4C10aEB0d8d588939862C`
* AVAXSummit2023Token `0x7e20936d9ea7A10c65c09190fdc277811c0a2472`
* AlphaTesterToken `0x0a320D4828e3492BE966d9e7DFfBbDF7320d12b2`
* ChiknMerchToken `0x788bf736231a195E7a704C5469c61b2961DF3472`

#### io-test

* AVAXSummit2023Token `0x96491ca49D8275042E581Cbc043d29dd14Df54C2`
* AlphaTesterToken `0x985b62F52E7Fc4F48bbf4CDCbe4c472f4C72d29B`

