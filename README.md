# STOMPS

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

## Commands

- `yarn build` clears cache and compiles smart contracts
- `yarn hardhat test [test file(s)]` runs the unit tests specified
- `yarn size` reports the size of your compiled smart contracts in KB
- `yarn coverage` runs solidity-coverage, make sure to stop the hardhat node process first

### Typechain

Generates typings for your contracts after compiling automatically (in `./typechain`)

### Mocha, chai, chai-ethers, chai-as-promised

Allows for easy testing with improved compatability with asynchronous functions and smart contracts (reverts, BigNumber, etc.)

### Hadhat-contract-sizer

Size matters on the blockchain. See [their docs](https://github.com/ItsNickBarry/hardhat-contract-sizer) for configuration details, but you can simply run `yarn size` and you'll get a breakdown of how big each contract is.

### Prettier

Configured for both your Solidity and Typescript code

### .env parsing

In `./utils/config.ts` you can configure your environment variables to have default values so things don't break midway through your script because you forgot an environment variable.

### Hooks

#### Precommit

Via Husky, check styling

#### On PR

Check that contracts compile and tests pass

### Static analysis

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
