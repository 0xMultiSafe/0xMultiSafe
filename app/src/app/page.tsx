"use client"

import { Button } from "@/components/ui/button"
import { deriveKeys } from "@/utils/derive"
import { shortenAddress } from "@/utils/format"
import { retrieveMultisigs } from "@/utils/retrieve"
import { useAuth } from "@clerk/nextjs"
import { NextPage } from "next"
import Image from "next/image"
import { useEffect, useState } from "react"

const Home: NextPage = () => {
  const { userId } = useAuth()

  const { privateKey } = deriveKeys(userId)

  const [deployedAddresses, setDeployedAddresses] = useState<{
    [key: string]: string[]
  }>()

  useEffect(() => {
    ;(async () => {
      if (!privateKey) return undefined

      const retrievedMultisigs = await retrieveMultisigs(privateKey)
      setDeployedAddresses(retrievedMultisigs)
    })()
  }, [privateKey])

  if (!userId) return <div>Not signed in</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold">My Multisigs</h1>
        <div className="flex items-center gap-2">
          <a href="/create">
            <Button>Create Multisig</Button>
          </a>
          <a href="">
            <Button variant="outline">Import Multisig</Button>
          </a>
        </div>
      </div>
      {deployedAddresses ? (
        Object.keys(deployedAddresses).map((address) => (
          <a
            href={`/${address}/dashboard`}
            className="w-full p-4 bg-secondary text-secondary-foreground rounded-lg cursor-pointer flex items-center gap-4"
          >
            <div className="flex items-center">
              {deployedAddresses[address].map((chainId) => (
                <Image
                  className="-mr-2"
                  src={`/chains/${chainId}.svg`}
                  alt={`${chainId}-logo`}
                  height={32}
                  width={32}
                />
              ))}
            </div>
            <p className="text-sm">{shortenAddress(address, 6)}</p>
          </a>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Home
