import hre from 'hardhat'
const { ethers } = require("hardhat");
import { addSubToken, chains } from './utils'

async function main() {
  const net = hre.network.name
  if (! chains.hasOwnProperty(net)) {
    console.log('chain not found');
    return;
  }

  const AlphaTesterToken = await ethers.getContractFactory("AlphaTesterToken");
  const alphaTesterToken = await AlphaTesterToken.deploy(chains[net].soulboundBaseTokenAddress);
  await alphaTesterToken.deployed();
  console.log("AlphaTesterToken deployed to:", alphaTesterToken.address);
  await alphaTesterToken.transferOwnership(chains[net].ownerAddress);
  console.log("AlphaTesterToken ownership transferred to:", chains[net].ownerAddress);

  await addSubToken(chains[net].soulboundBaseTokenAddress, alphaTesterToken.address);
}

main()
