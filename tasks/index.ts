import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("base:subtoken:enabled", "Check if subtoken is enabled")
.addParam("base", "Base address")
.addParam("subtoken", "Subtoken address")
.setAction(async ({ base, subtoken }, hre) => {
  const BaseContract = await hre.ethers.getContractFactory("SoulBoundBaseToken");
  const baseContract = await BaseContract.attach(base);
  console.log(await baseContract._subTokensEnabled(subtoken));
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
