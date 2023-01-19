const { ethers, upgrades } = require("hardhat");

async function main() {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const soulboundBaseToken = await upgrades.deployProxy(SoulBoundBaseToken, [
    /* no construct params */
  ]);
  await soulboundBaseToken.deployed();
  console.log("SoulBoundBaseToken deployed to:", soulboundBaseToken.address);
}

main();
