import { envconfig } from "./utils/config";
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-docgen";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";

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
    fuji: {
      url: envconfig.fuji.provider_url,
      accounts: [`0x${envconfig.fuji.private_key}`],
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  contractSizer: {},
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: envconfig.snowtrace.api_key,
  },
};

export default config;
