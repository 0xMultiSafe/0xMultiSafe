"use client"

import { FC, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useAuth } from "@clerk/nextjs"
import { deriveKeys } from "@/utils/derive"
import { retrieveMultisig } from "@/utils/retrieve"
import { Button } from "../ui/button"
import { confirmTransaction } from "@/utils/send"
import Image from "next/image"
import { TOKEN_ADDRESS_TO_NAME } from "@/constants"
import { toast } from "sonner"

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
    const fetchMultisigs = async () => {
      if (!privateKey || !multisig || !address) return undefined

      const retrievedMultisigs = await retrieveMultisig(
        privateKey,
        address,
        multisig
      )
      setMultisigs(retrievedMultisigs)
    }

    fetchMultisigs()

    const interval = setInterval(fetchMultisigs, 5000)

    return () => clearInterval(interval)
  }, [privateKey, multisig, address])

  const confirm = async (transactionId: number, chainId: string) => {
    if (!privateKey || !multisig)
      return console.error("Missing privateKey or multisig")
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

              if ((tx as any)[4]) return undefined

              const token =
                TOKEN_ADDRESS_TO_NAME[
                  (
                    tx as any
                  )[1].toLowerCase() as keyof typeof TOKEN_ADDRESS_TO_NAME
                ] || (tx as any)[1]

              return (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/chains/${indMultisig}.svg`}
                      alt={`${indMultisig}-logo`}
                      width={32}
                      height={32}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Send {Number((tx as any)[2]) / 1e18} {token} to{" "}
                        {(tx as any)[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Required: {required}/
                        {(tx as { owners: string[] }).owners.length}
                      </p>
                    </div>
                  </div>
                  {!isConfirmed && (
                    <div className="ml-auto font-medium flex items-center gap-2">
                      <Button
                        onClick={() =>
                          confirm(
                            (tx as { i: number }).i,
                            (tx as { chainId: string }).chainId
                          )
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() =>
                          toast.error(
                            "The reject function is currently unavailable!"
                          )
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          })}
      </CardContent>
    </Card>
  )
}

export default PendingTransactions
