const { ethers } = require("hardhat");
import { addSubToken } from './utils'

const soulboundBaseTokenAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
const ownerAddress = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';
// const soulboundBaseTokenAddress = null;
// const ownerAddress = null;

async function main() {
  const AVAXSummit2023Token = await ethers.getContractFactory("AVAXSummit2023Token");
  const avaxSummit2023Token = await AVAXSummit2023Token.deploy(soulboundBaseTokenAddress);
  await avaxSummit2023Token.deployed();
  console.log("AVAXSummit2023Token deployed to:", avaxSummit2023Token.address);
  await avaxSummit2023Token.transferOwnership(ownerAddress);
  console.log("AVAXSummit2023Token ownership transferred to:", ownerAddress);

  await addSubToken(soulboundBaseTokenAddress, avaxSummit2023Token.address);
}

main()
