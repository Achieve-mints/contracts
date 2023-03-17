const { ethers, upgrades } = require("hardhat");

interface ChainDetails {
  soulboundBaseTokenAddress: string;
  ownerAddress: string;
}

export const chains: {[id: string]: ChainDetails}= {
  'localhost': {
    soulboundBaseTokenAddress: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    // This is for the Alpha Tester owner and avax summit owner
    ownerAddress: '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
  },
  'iotest': {
    soulboundBaseTokenAddress: '0xf5443a26988dBe6Ab1b21FBE352B56717dAeB957',
    ownerAddress: '0x806A02A0Ae1863Be62682722C011ce6B9D23160B',
  }
}

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
