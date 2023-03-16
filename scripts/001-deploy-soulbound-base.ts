const { ethers, upgrades } = require("hardhat");
import { addSubToken, grantRole } from './utils'

const DEFAULT_ADMIN_ROLE_CODE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  const SoulBoundBaseToken = await ethers.getContractFactory(
    "SoulBoundBaseToken"
  );
  const soulboundBaseToken = await upgrades.deployProxy(SoulBoundBaseToken, [
    /* no construct params */
  ]);
  await soulboundBaseToken.deployed();
  console.log("SoulBoundBaseToken deployed to:", soulboundBaseToken.address);

  // grant to don
  await grantRole(
    soulboundBaseToken.address,
    DEFAULT_ADMIN_ROLE_CODE,
    '0x41213551b86FCC7bBFd073696e38c48A2Dd81180'
  );

  // grant to josh
  await grantRole(
    soulboundBaseToken.address,
    DEFAULT_ADMIN_ROLE_CODE,
    '0xf980b0EBf8ED5eab0B867A2cabf123156DC0500f'
  );
}

main();
