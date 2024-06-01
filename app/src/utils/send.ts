import { CHAIN_RPC_URL } from "@/constants"
import { MULTISIG_ABI } from "@/constants/abi"
import { ethers } from "ethers"
import { toast } from "sonner"

export const submitTransaction = async (
  privateKey: string,
  multisig: string,
  srcChain: string,
  to: string,
  token: string,
  value: string,
  linkToken?: string,
  destinationChainSelector?: bigint,
  ccipRouter?: string,
  data?: string
) => {
  try {
    const url = CHAIN_RPC_URL[Number(srcChain) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)
    const multisigContract = new ethers.Contract(multisig, MULTISIG_ABI, wallet)
    const { tx } = await multisigContract.submitTransaction(
      to, // to
      token, // token
      ethers.parseEther(value), // value
      data ?? "0x", // data
      linkToken ?? "0x0000000000000000000000000000000000000000", // linkToken
      destinationChainSelector ?? 0, // destinationChainSelector
      ccipRouter ?? "0x0000000000000000000000000000000000000000" // ccipRouter
    )

    toast.success("✨ Transaction submitted successfully!✨", {
      description: "View it in the pending transactions page.",
    })

    return tx as string
  } catch (e) {
    console.error(e)
    toast.error("❌ Failed to submit your transaction ❌", {
      description: "Please try again or contact me if the issue persists.",
    })
    return undefined
  }
}

export const confirmTransaction = async (
  privateKey: string,
  multisig: string,
  transactionId: number,
  chainId: string
) => {
  try {
    const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const wallet = new ethers.Wallet(privateKey, provider)
    const multisigContract = new ethers.Contract(multisig, MULTISIG_ABI, wallet)
    const tx = await multisigContract.confirmTransaction(transactionId)

    toast.success("✨ Transaction confirmed successfully!✨", {
      description: "Check your recipient address for the funds.",
    })

    return tx as string
  } catch (e) {
    console.error(e)
    toast.error("❌ Failed to confirm your transaction ❌", {
      description: "Please try again or contact me if the issue persists.",
    })
  }
}
