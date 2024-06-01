"use client"

import { FC, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { useAuth } from "@clerk/nextjs"
import { deriveKeys } from "@/utils/derive"
import { retrieveMultisig } from "@/utils/retrieve"

interface Props {
  multisig: string
}

const PendingTransactions: FC<Props> = ({ multisig }) => {
  const { userId } = useAuth()
  const { privateKey } = deriveKeys(userId)

  useEffect(() => {
    if (!privateKey || !multisig) return undefined

    retrieveMultisig(privateKey, multisig)
  }, [privateKey, multisig])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PendingTransactions
