import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

// Add custom network configurations
const customNetworks: Record<string, any> = {
  kairos: {
    chainId: 1001,
    url: "https://responsive-green-emerald.kaia-kairos.quiknode.pro/",
    accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
  },
  kaia: {
    chainId: 8217,
    url: "https://public-en.node.kaia.io",
    accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
  }
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true, // or false if it was disabled during deployment
        runs: 200,
      },
    },
  },
  networks: {
    kairos: {
      url: "https://responsive-green-emerald.kaia-kairos.quiknode.pro/",
      accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
      chainId: 1001,
    },
    kaia: {
      url: "https://public-en.node.kaia.io",
      accounts: process.env.SIGNER ? [process.env.SIGNER] : [],
      chainId: 8217,
    }
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  },
  etherscan: {
    apiKey: {
      kairos: "unnecessary", // The actual value doesn't matter for Sourcify
      kaia: "unnecessary"    // The actual value doesn't matter for Sourcify
    },
    customChains: [
      {
        network: "kairos",
        chainId: 1001,
        urls: {
          apiURL: "https://api-baobab.klaytnscope.com/api",
          browserURL: "https://kairos.kaiascope.com",
        }
      },
      {
        network: "kaia",
        chainId: 8217,
        urls: {
          apiURL: "https://api-cypress.klaytnscope.com/api",
          browserURL: "https://kaiascope.com/",
        }
      }
    ]
  }
};

export default config;