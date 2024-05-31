import "@nomicfoundation/hardhat-toolbox-viem"
import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"
import "./scripts/deploy"
import "./scripts/generate"

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
      accounts,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc.ankr.com/polygon_mumbai",
      accounts,
    },
    linea_goerli: {
      url: process.env.LINEA_GOERLI_RPC_URL || `https://rpc.goerli.linea.build`,
      accounts,
    },
    linea_sepolia: {
      url:
        process.env.LINEA_SEPOLIA_RPC_URL || `https://rpc.sepolia.linea.build`,
      accounts,
    },
    optimism_sepolia: {
      url:
        process.env.OPTIMISM_SEPOLIA_RPC_URL || `https://sepolia.optimism.io`,
      accounts,
    },
    neon_devnet: {
      url: process.env.NEON_DEVNET_RPC_URL || "https://devnet.neonevm.org",
      accounts,
      chainId: 245022926,
    },
  },
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY",
  },
  // etherscan: {
  //   apiKey: {
  //     neonevm: "test",
  //   },
  //   customChains: [
  //     {
  //       network: "neonevm",
  //       chainId: 245022926,
  //       urls: {
  //         apiURL: "https://devnet-api.neonscan.org/hardhat/verify",
  //         browserURL: "https://devnet.neonscan.org",
  //       },
  //     },
  //     {
  //       network: "neonevm",
  //       chainId: 245022934,
  //       urls: {
  //         apiURL: "https://api.neonscan.org/hardhat/verify",
  //         browserURL: "https://neonscan.org",
  //       },
  //     },
  //   ],
  // },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  mocha: {
    timeout: 20000,
  },
  sourcify: {
    enabled: true,
  },
}

export default config
