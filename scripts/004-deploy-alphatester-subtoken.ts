const { ethers } = require("hardhat");
import { addSubToken } from './utils'

const soulboundBaseTokenAddress = null;
const ownerAddress = null;

async function main() {
  const AlphaTesterToken = await ethers.getContractFactory("AlphaTesterToken");
  const alphaTesterToken = await AlphaTesterToken.deploy(soulboundBaseTokenAddress);
  await alphaTesterToken.deployed();
  console.log("AlphaTesterToken deployed to:", alphaTesterToken.address);
  await alphaTesterToken.transferOwnership(ownerAddress);
  console.log("AlphaTesterToken ownership transferred to:", ownerAddress);

  await addSubToken(soulboundBaseTokenAddress, alphaTesterToken.address);
}

main()
