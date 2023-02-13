const { ethers, upgrades } = require("hardhat");

const DEFAULT_ADMIN_ROLE_CODE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function addSubToken(baseAddress: string, subtokenAddress: string) {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const base = SoulBoundBaseToken.attach(baseAddress);

  await base.setSubToken(subtokenAddress, true);
  console.log(`SubToken ${subtokenAddress} added`);
}

async function grantRole(baseAddress: string, roleCode: string, adminAddress: string) {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const base = SoulBoundBaseToken.attach(baseAddress);

  await base.grantRole(roleCode, adminAddress);
  console.log(`Role ${roleCode} granted to ${adminAddress}`);
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

  // grant to don
  await grantRole(
    soulboundBaseToken.address,
    DEFAULT_ADMIN_ROLE_CODE,
    '0x41213551b86FCC7bBFd073696e38c48A2Dd81180'
  );

  // grant to josh
  await grantRole(
    soulboundBaseToken.address,
    DEFAULT_ADMIN_ROLE_CODE,
    '0xf980b0EBf8ED5eab0B867A2cabf123156DC0500f'
  );
}

main();
