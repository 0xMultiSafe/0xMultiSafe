import { CHAIN_RPC_URL, CREATE2_DEPLOYER_ADDRESS } from "@/constants"
import { CREATE2_DEPLOYER_ABI } from "@/constants/abi"
import { ethers } from "ethers"
import { toast } from "sonner"

export const deployMultisig = async (
  chains: number[],
  owners: string[],
  required: number,
  privateKey: string
) => {
  chains.forEach(async (chainId) => {
    try {
      const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
      const provider = new ethers.JsonRpcProvider(url)
      const wallet = new ethers.Wallet(privateKey, provider)
      const create2DeployerContract = new ethers.Contract(
        CREATE2_DEPLOYER_ADDRESS,
        CREATE2_DEPLOYER_ABI,
        wallet
      )

      const bytecode = await create2DeployerContract.getBytecode(
        owners,
        required
      )

      // TODO: DETERMINISTIC SALT
      const { hash } = await create2DeployerContract.deployUsingCreate2(
        bytecode,
        "123"
      )

      console.log("Transaction:", hash)
      toast.success("✨ Multisig deployed successfully!✨", {
        description: "View your available multisigs on your home page.",
      })
      return hash as string
    } catch (e) {
      console.error(e)
      toast.error("❌ Failed to deploy your multisig ❌", {
        description: "Please try again or contact me if the issue persists.",
      })
    }
  })
}
