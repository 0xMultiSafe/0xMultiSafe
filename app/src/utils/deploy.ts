import { CHAIN_RPC_URL, CREATE2_DEPLOYER_ADDRESS } from "@/constants"
import { CREATE2_DEPLOYER_ABI } from "@/constants/abi"
import { ethers } from "ethers"

export const deployMultisig = async (
  chains: number[],
  owners: string[],
  required: number,
  privateKey: string
) => {
  chains.forEach(async (chainId) => {
    const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)
    const create2DeployerContract = new ethers.Contract(
      CREATE2_DEPLOYER_ADDRESS,
      CREATE2_DEPLOYER_ABI,
      wallet
    )

    const bytecode = await create2DeployerContract.getBytecode(owners, required)
    console.log("Bytecode:", bytecode)

    const tx = await create2DeployerContract.deployUsingCreate2(bytecode, "123")

    console.log("Transaction:", tx)
  })
}
