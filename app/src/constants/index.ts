export const CHAIN_RPC_URL = {
  97: "https://bsc-testnet-rpc.publicnode.com",
  43113: "https://rpc.ankr.com/avalanche_fuji",
  59141: "https://rpc.sepolia.linea.build",
  11155111: "https://sepolia.drpc.org",
  11155420: "https://sepolia.optimism.io",
  245022926: "https://neon-evm-devnet.drpc.org",
}

export const CREATE2_DEPLOYER_ADDRESS =
  "0xf2C768098fb419b49D24a51dfCFD56d80dE69500"

export const TOKEN_ADDRESS = "0xd476a982675FBB5973e2F0E833032720313D7427"

export const TOKEN_ADDRESS_TO_NAME = {
  [TOKEN_ADDRESS]: "USDC",
}

export const CHAIN_SELECTOR = {
  97: "13264668187771770619",
  43113: "14767482510784806043",
  59141: "",
  11155111: "16015286601757825753",
  11155420: "5224473277236331295",
  245022926: "",
}

export const CCIP_ROUTE_META = {
  97: {
    router: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
  },
  43113: {
    router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  },
  59141: {
    router: "",
    linkToken: "",
  },
  11155111: {
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  },
  11155420: {
    router: "0x114A20A10b43D4115e5aeef7345a1A71d2a60C57",
    linkToken: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  },
  245022926: {
    router: "",
    linkToken: "",
  },
}
