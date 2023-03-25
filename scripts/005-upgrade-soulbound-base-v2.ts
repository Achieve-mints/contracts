import hre from 'hardhat'
const { ethers, upgrades } = require("hardhat");
import { chains } from './utils'

async function main() {
  const net = hre.network.name
  if (! chains.hasOwnProperty(net)) {
    console.log('chain not found');
    return;
  }

  const SoulBoundBaseTokenV2 = await ethers.getContractFactory(
    "SoulBoundBaseTokenV2"
  );
  await upgrades.upgradeProxy(chains[net].soulboundBaseTokenAddress, SoulBoundBaseTokenV2);
  console.log('SoulBoundBaseToken upgraded');
}

main();
