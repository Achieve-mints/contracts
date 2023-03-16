const { ethers } = require("hardhat");
import { addSubToken } from './utils'

const soulboundBaseTokenAddress = null;

async function main() {
  const ExampleToken = await ethers.getContractFactory("ExampleToken");
  const exampleToken = await ExampleToken.deploy(soulboundBaseTokenAddress);
  await exampleToken.deployed();
  console.log("ExampleToken deployed to:", exampleToken.address);

  await addSubToken(soulboundBaseTokenAddress, exampleToken.address);
}

main()
