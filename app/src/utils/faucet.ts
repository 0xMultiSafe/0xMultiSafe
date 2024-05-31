import { ethers } from "ethers"
import { CHAIN_RPC_URL } from "@/constants"
import { env } from "../env.mjs"

export const faucetDrip = async (address: string) => {
  for (const chainId in CHAIN_RPC_URL) {
    const url = CHAIN_RPC_URL[Number(chainId) as keyof typeof CHAIN_RPC_URL]
    const provider = new ethers.JsonRpcProvider(url)
    const balance = await provider.getBalance(address)

    if (balance === BigInt(0)) {
      console.log(`Dripping 0.001 ETH on chain ${chainId} for address ${address}`)
      
      const wallet = new ethers.Wallet(env.NEXT_PUBLIC_FAUCET_PRIVATE_KEY, provider)
      const amount = ethers.parseEther("0.001")

      const result = await wallet.sendTransaction({
        to: address,
        value: amount
      })
      console.log(`Transaction hash: ${result.hash}`)
    }
  }
}