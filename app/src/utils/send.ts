import { CHAIN_RPC_URL } from "@/constants"
import { MULTISIG_ABI } from "@/constants/abi"
import { ethers } from "ethers"

// TODO: Implement submitTransaction function
export const submitTransaction = async (
  srcChain: string,
  privateKey: string,
  multisig: string
) => {
  const url = CHAIN_RPC_URL[Number(srcChain) as keyof typeof CHAIN_RPC_URL]
  console.log(url, multisig)
  const provider = new ethers.JsonRpcProvider(url)
  const wallet = new ethers.Wallet(privateKey, provider)
  const multisigContract = new ethers.Contract(multisig, MULTISIG_ABI, wallet)
  console.log(multisigContract)
  const tx = await multisigContract.submitTransaction(
    "0x1e839e79DF349cd220bBBCED6f9EC2351f5ECB17", // to
    "0x1e839e79DF349cd220bBBCED6f9EC2351f5ECB17", // token
    10000, // value
    "0x", // data
    "0x0000000000000000000000000000000000000000", // linkToken
    0, // destinationChainSelector
    "0x0000000000000000000000000000000000000000" // ccipRouter
  )

  console.log(tx)
}

export const confirmTransaction = async (
  privateKey: string,
  multisig: string,
  transactionId: number,
  chainId: string
) => {
  const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
  const provider = new ethers.JsonRpcProvider(url)
  const wallet = new ethers.Wallet(privateKey, provider)
  const multisigContract = new ethers.Contract(multisig, MULTISIG_ABI, wallet)
  const tx = await multisigContract.confirmTransaction(transactionId)
  console.log(tx)
}