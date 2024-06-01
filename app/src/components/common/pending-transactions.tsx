"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useAuth } from "@clerk/nextjs"
import { deriveKeys } from "@/utils/derive"
import { retrieveMultisig } from "@/utils/retrieve"
import { Button } from "../ui/button"
import { confirmTransaction } from "@/utils/send"

interface Props {
  multisig: string
}

const PendingTransactions: FC<Props> = ({ multisig }) => {
  const { userId } = useAuth()
  const { address, privateKey } = deriveKeys(userId)

  const [multisigs, setMultisigs] = useState<{
    [key: string]: object[]
  }>()

  useEffect(() => {
    ;(async () => {
      if (!privateKey || !multisig || !address) return undefined

      const retrievedMultisigs = await retrieveMultisig(privateKey, address, multisig)
      setMultisigs(retrievedMultisigs)
    })()
  }, [privateKey, multisig])

  const confirm = async (transactionId: number, chainId: string) => {
    if (!privateKey || !multisig) return console.error("Missing privateKey or multisig")
    confirmTransaction(privateKey, multisig, transactionId, chainId)
  } 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {multisigs &&
          Object.keys(multisigs).map((indMultisig) => {
            const txs = multisigs[indMultisig]
            return txs.map((tx) => {
              const required = Number((tx as { required: string }).required)
              const isConfirmed = (tx as { isConfirmed: boolean }).isConfirmed

              return (
                <div className="flex items-center gap-4">
                  <div className="grid gap-1">
                    {/* TODO: IMAGE of chain */}
                    <p className="text-sm font-medium leading-none">
                      Send {Number((tx as any)[2])} {(tx as any)[1]} to {(tx as any)[0]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Required: {required}/{(tx as { owners: string[] }).owners.length}
                    </p>
                  </div>
                  {!isConfirmed && <div className="ml-auto font-medium flex items-center gap-2">
                    <Button onClick={() => confirm((tx as { i: number }).i, (tx as { chainId: string }).chainId)}>Confirm</Button>
                    <Button variant={'destructive'}>Reject</Button>
                  </div>}
                </div>
              )
            })
          })}
      </CardContent>
    </Card>
  )
}

export default PendingTransactions
