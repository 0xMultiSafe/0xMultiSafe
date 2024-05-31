import { CHAIN_RPC_URL, CREATE2_DEPLOYER_ADDRESS } from "@/constants"
import { CREATE2_DEPLOYER_ABI } from "@/constants/abi"
import { ethers } from "ethers"

export const retrieveMultisig = async (privateKey: string) => {
  const multisigChains: { [key: string]: any[] } = {}
  const addressChains: { [key: string]: string[] } = {}

  const promises = Object.keys(CHAIN_RPC_URL).map(async (chainId) => {
    const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)

    const create2DeployerContract = new ethers.Contract(
      CREATE2_DEPLOYER_ADDRESS,
      CREATE2_DEPLOYER_ABI,
      wallet
    )

    const deployMultisigs = await create2DeployerContract.getDeployedAddresses()

    multisigChains[chainId] = deployMultisigs

    // Add each address to the corresponding chains
    deployMultisigs.forEach((address: string) => {
      if (!addressChains[address]) {
        addressChains[address] = []
      }
      addressChains[address].push(chainId)
    })
  })

  await Promise.all(promises)

  return addressChains
}