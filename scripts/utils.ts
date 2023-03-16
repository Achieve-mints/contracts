const { ethers, upgrades } = require("hardhat");

export async function addSubToken(baseAddress: string, subtokenAddress: string) {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const base = SoulBoundBaseToken.attach(baseAddress);

  await base.setSubToken(subtokenAddress, true);
  console.log(`SubToken ${subtokenAddress} added`);
}

export async function grantRole(baseAddress: string, roleCode: string, adminAddress: string) {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const base = SoulBoundBaseToken.attach(baseAddress);

  await base.grantRole(roleCode, adminAddress);
  console.log(`Role ${roleCode} granted to ${adminAddress}`);
}
