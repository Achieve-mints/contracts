import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("gen-wallet", "Creates a new wallet", async (taskArgs, hre) => {
  const wallet = hre.ethers.Wallet.createRandom();
  console.log('address', wallet.address);
  console.log('mnemonic', wallet.mnemonic.phrase);
  console.log('privateKey', wallet.privateKey);
});

task("base:subtoken:enabled", "Check if subtoken is enabled")
.addParam("base", "Base address")
.addParam("subtoken", "Subtoken address")
.setAction(async ({ base, subtoken }, hre) => {
  const BaseContract = await hre.ethers.getContractFactory("SoulBoundBaseToken");
  const baseContract = await BaseContract.attach(base);
  console.log(await baseContract._subTokensEnabled(subtoken));
});

task("base:setBaseURI", "Set new base uri")
.addParam("base", "Base address")
.addParam("uri", "Subtoken address")
.setAction(async ({ base, uri }, hre) => {
  const BaseContract = await hre.ethers.getContractFactory("SoulBoundBaseToken");
  const baseContract = await BaseContract.attach(base);
  console.log(await baseContract.setBaseURI(uri));
});

task("base:tokenURI", "Get URI of token")
.addParam("base", "Base address")
.addParam("tokenid", "token id")
.setAction(async ({ base, tokenid }, hre) => {
  const BaseContract = await hre.ethers.getContractFactory("SoulBoundBaseToken");
  const baseContract = await BaseContract.attach(base);
  console.log(await baseContract.tokenURI(tokenid));
});



task("nft:metadata", "Look up metadata of a token")
.addParam("base", "Base address")
.addParam("id", "Token Id")
.setAction(async ({ base, id }, hre) => {
  const BaseContract = await hre.ethers.getContractFactory("SoulBoundBaseToken");
  const baseContract = await BaseContract.attach(base);

  const abiCoder = new hre.ethers.utils.AbiCoder();
  const metadata = await baseContract.metadata(id);

  // TODO add different decoders based on subtoken address
  const decoded = abiCoder.decode(["string"], metadata);
  console.log(decoded[0]);
});

task("alphatester:mint", "Mint alphatester token")
.addParam("alphatester", "Alphatester address")
.addParam("address", "Address to mint to")
.setAction(async ({ alphatester, address }, hre) => {
  const [deployer, alphatestOwner] = await hre.ethers.getSigners();

  const AlphaTesterToken = await hre.ethers.getContractFactory("AlphaTesterToken");
  const alphaTesterToken = await AlphaTesterToken.attach(alphatester);

  const tx = await alphaTesterToken.connect(alphatestOwner).mint(address);
  console.log(tx);
  console.log(await tx.wait());
});
