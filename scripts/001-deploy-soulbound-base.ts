const { ethers, upgrades } = require("hardhat");

async function addSubToken(baseAddress: string, subtokenAddress: string) {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const base = SoulBoundBaseToken.attach(baseAddress);

  await base.setSubToken(subtokenAddress, true);
  console.log(`SubToken ${subtokenAddress} added`);
}

async function main() {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const soulboundBaseToken = await upgrades.deployProxy(SoulBoundBaseToken, [
    /* no construct params */
  ]);
  await soulboundBaseToken.deployed();
  console.log("SoulBoundBaseToken deployed to:", soulboundBaseToken.address);

  // now we deploy a subtoken

  const ExampleToken = await ethers.getContractFactory("ExampleToken");
  const exampleToken = await ExampleToken.deploy(soulboundBaseToken.address);
  await exampleToken.deployed();
  console.log("ExampleToken deployed to:", exampleToken.address);

  await addSubToken(soulboundBaseToken.address, exampleToken.address);
}

main();
