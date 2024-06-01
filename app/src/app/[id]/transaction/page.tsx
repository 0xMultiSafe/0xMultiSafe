"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CCIP_ROUTE_META, CHAIN_SELECTOR, TOKEN_ADDRESS } from "@/constants"
import { deriveKeys } from "@/utils/derive"
import { submitTransaction } from "@/utils/send"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import { toast } from "sonner"

const TransactionPage = ({ params }: { params: { id: string } }) => {
  const { userId } = useAuth()

  const { address, privateKey } = deriveKeys(userId)

  const [token, setToken] = useState("")
  const [srcChain, setSrcChain] = useState("")
  const [amount, setAmount] = useState<number>()
  const [dstChain, setDstChain] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")

  const sendTransaction = async () => {
    if (!privateKey || !amount) return

    // const selector = BigInt("16015286601757825753")
    // const linkToken = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"
    // const router = "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f"

    let tx: string | undefined

    if (srcChain === dstChain)
      tx = await submitTransaction(
        privateKey,
        params.id,
        srcChain,
        recipientAddress,
        token,
        amount.toString()
      )
    else {
      const chainSelector =
        CHAIN_SELECTOR[Number(dstChain) as keyof typeof CHAIN_SELECTOR]

      if (!chainSelector)
        return toast.error("❌ Destination chain not supported ❌", {
          description:
            "Please select a different destination chain to use CCIP.",
        })

      const { linkToken, router } =
        CCIP_ROUTE_META[Number(srcChain) as keyof typeof CCIP_ROUTE_META]

      tx = await submitTransaction(
        privateKey,
        params.id,
        srcChain,
        recipientAddress,
        token,
        amount.toString(),
        linkToken,
        BigInt(chainSelector),
        router
      )
    }

    if (tx) {
      setToken("")
      setSrcChain("")
      setAmount(undefined)
      setDstChain("")
      setRecipientAddress("")
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-96 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Send Transaction</CardTitle>
            <CardDescription>
              Send an asset from one chain to another.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4 w-full">
              <Select onValueChange={(e) => setToken(e)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a token..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={TOKEN_ADDRESS}>USDC</SelectItem>
                    <SelectItem
                      value={"0xbFA2ACd33ED6EEc0ed3Cc06bF1ac38d22b36B9e9"}
                    >
                      CCIP
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select onValueChange={(e) => setSrcChain(e)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select src chain..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="97">BNB Smart Chain Testnet</SelectItem>
                    <SelectItem value="43113">Avalanche Fiji</SelectItem>
                    <SelectItem value="59141">Linea Sepolia</SelectItem>
                    <SelectItem value="11155111">Sepolia</SelectItem>
                    <SelectItem value="11155420">Optimism Sepolia</SelectItem>
                    <SelectItem value="245022926">NeonEVM Devnet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5 w-full pt-2">
              <Label>Amount</Label>
              <Input
                type="number"
                className="input"
                placeholder="Enter an amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
              />
            </div>
            <div className="flex flex-col space-y-1.5 w-full pt-2">
              <Label>Destination Chain</Label>
              <Select onValueChange={(e) => setDstChain(e)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a destination chain..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="97">BNB Smart Chain Testnet</SelectItem>
                    <SelectItem value="43113">Avalanche Fiji</SelectItem>
                    <SelectItem value="59141">Linea Sepolia</SelectItem>
                    <SelectItem value="11155111">Sepolia</SelectItem>
                    <SelectItem value="11155420">Optimism Sepolia</SelectItem>
                    <SelectItem value="245022926">NeonEVM Devnet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5 w-full pt-2">
              <Label>Recipient Address</Label>
              <Input
                type="text"
                className="input"
                placeholder="Enter a recipient address..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>

            <Button onClick={sendTransaction}>Send Transaction</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TransactionPage
