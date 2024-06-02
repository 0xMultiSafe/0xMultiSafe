import { CHAIN_RPC_URL, CREATE2_DEPLOYER_ADDRESS } from "@/constants"
import { CREATE2_DEPLOYER_ABI, MULTISIG_ABI } from "@/constants/abi"
import { ethers } from "ethers"

export const retrieveMultisigs = async (privateKey: string) => {
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

    const code = await provider.getCode(CREATE2_DEPLOYER_ADDRESS)
    if (code === "0x") {
      console.error(`No contract found at ${create2DeployerContract.address}`)
      return
    }

    try {
      await create2DeployerContract.getDeployedAddresses()
    } catch (error) {
      console.error("Contract does not have the getDeployedAddresses function")
      return
    }

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

  console.log("Retrieved multisigs", addressChains)

  return addressChains
}

export const retrieveMultisig = async (
  privateKey: string,
  address: string,
  multisig: string
) => {
  const multisigs: { [key: string]: object[] } = {}

  const promises = Object.keys(CHAIN_RPC_URL).map(async (chainId) => {
    const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)

    const multisigContract = new ethers.Contract(multisig, MULTISIG_ABI, wallet)

    // Check if the contract exists at the multisig address
    if ((await provider.getCode(multisig)) === "0x") return

    const transactionCount = await multisigContract.getTransactionCount()

    if (transactionCount === 0) return

    for (let i = 0; i < transactionCount; i++) {
      const transaction = await multisigContract.getTransaction(i)
      const owners = await multisigContract.getOwners()
      const required = await multisigContract.required()
      const isConfirmed = await multisigContract.isConfirmed(i, address)

      if (!multisigs[chainId]) {
        multisigs[chainId] = []
      }
      multisigs[chainId].push({ ...transaction, owners, required, isConfirmed, i, chainId })
    }
  })

  await Promise.all(promises)

  return multisigs
}
