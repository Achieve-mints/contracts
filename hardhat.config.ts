import { envconfig } from "./utils/config";
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";

// user created tasks
import "./tasks/index";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url: envconfig.rinkeby.provider_url,
      //   accounts: [`0x${envconfig.rinkeby.private_key}`],
    },
    mainnet: {
      url: envconfig.mainnet.provider_url,
      //   accounts: [`0x${envconfig.mainnet.private_key}`],
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  contractSizer: {},
};

export default config;
