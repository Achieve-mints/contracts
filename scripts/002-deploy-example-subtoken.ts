import hre from 'hardhat'
const { ethers } = require("hardhat");
import { addSubToken, chains } from './utils'

async function main() {
  const net = hre.network.name
  if (! chains.hasOwnProperty(net)) {
    console.log('chain not found');
    return;
  }

  const ExampleToken = await ethers.getContractFactory("ExampleToken");
  const exampleToken = await ExampleToken.deploy(chains[net].soulboundBaseTokenAddress);
  await exampleToken.deployed();
  console.log("ExampleToken deployed to:", exampleToken.address);

  await addSubToken(chains[net].soulboundBaseTokenAddress, exampleToken.address);
}

main()
