'use client'

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
import { deriveKeys } from "@/utils/derive"
import { submitTransaction } from "@/utils/send"
import { useAuth } from "@clerk/nextjs"
import { useState } from "react"

const TransactionPage = ({ params }: { params: { id: string } }) => {
  const { userId } = useAuth()

  const { address, privateKey } = deriveKeys(userId)


  const [token, setToken] = useState('');
  const [srcChain, setSrcChain] = useState('');
  const [amount, setAmount] = useState<number>();
  const [dstChain, setDstChain] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const sendTransaction = async () => {
    if (!privateKey) return
    console.log('Sending transaction...')
    console.log({ token, srcChain, amount, dstChain, recipientAddress })

    const tx = await submitTransaction(srcChain, privateKey, params.id)
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
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
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
