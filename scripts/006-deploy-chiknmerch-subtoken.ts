import hre from 'hardhat'
const { ethers } = require("hardhat");
import { addSubToken, chains } from './utils'

async function main() {
  const net = hre.network.name
  if (! chains.hasOwnProperty(net)) {
    console.log('chain not found');
    return;
  }

  const ChiknMerchToken = await ethers.getContractFactory("ChiknMerchToken");
  const chiknMerchToken = await ChiknMerchToken.deploy(chains[net].soulboundBaseTokenAddress);
  await chiknMerchToken.deployed();
  console.log("ChiknMerchToken deployed to:", chiknMerchToken.address);
  await chiknMerchToken.transferOwnership(chains[net].ownerAddress);
  console.log("ChiknMerchToken ownership transferred to:", chains[net].ownerAddress);

  await addSubToken(chains[net].soulboundBaseTokenAddress, chiknMerchToken.address);
}

main()
