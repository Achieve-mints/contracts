import hre from 'hardhat'
const { ethers } = require("hardhat");
import { addSubToken, chains } from './utils'

async function main() {
  const net = hre.network.name
  if (! chains.hasOwnProperty(net)) {
    console.log('chain not found');
    return;
  }

  const AVAXSummit2023Token = await ethers.getContractFactory("AVAXSummit2023Token");
  const avaxSummit2023Token = await AVAXSummit2023Token.deploy(chains[net].soulboundBaseTokenAddress);
  await avaxSummit2023Token.deployed();
  console.log("AVAXSummit2023Token deployed to:", avaxSummit2023Token.address);
  await avaxSummit2023Token.transferOwnership(chains[net].ownerAddress);
  console.log("AVAXSummit2023Token ownership transferred to:", chains[net].ownerAddress);

  await addSubToken(chains[net].soulboundBaseTokenAddress, avaxSummit2023Token.address);
}

main()
