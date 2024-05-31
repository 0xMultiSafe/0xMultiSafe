"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignedIn, useAuth } from "@clerk/nextjs"
import { ChevronLeft } from "lucide-react"
import { NextPage } from "next"
import MultipleSelector, { Option } from "@/components/ui/multiple-selector"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { Switch } from "@/components/ui/switch"
import { deriveKeys } from "@/utils/derive"
import { deployMultisig } from "@/utils/deploy"

const Create: NextPage = () => {
  const { userId } = useAuth()
  const { address, privateKey } = deriveKeys(userId)

  const CHAINS: Option[] = [
    { label: "BNB Smart Chain Testnet", value: "97" },
    { label: "Linea Sepolia", value: "59141" },
    { label: "Optimism Sepolia", value: "11155420" },
    { label: "NeonEVM Devnet", value: "245022926" },
  ]

  const [threshold, setThreshold] = useState(1)
  const [selectedChains, setSelectedChains] = useState<Option[]>([])
  const [owners, setOwners] = useState<string[]>(["", ""])
  const [beneficiaries, setBeneficiaries] = useState<string[]>([""])
  const [activeTab, setActiveTab] = useState<string>("single")
  const [socialRecovery, setSocialRecovery] = useState(false)
  const [recoveryPeriod, setRecoveryPeriod] = useState(43830)

  const deploy = async () => {
    if (!address || !privateKey) return undefined

    const deployChains = selectedChains.map((chain) => Number(chain.value))

    switch (activeTab) {
      case "single":
        deployMultisig(deployChains, [address], 1, privateKey)
        break
      case "multi":
        deployMultisig(deployChains, owners, threshold, privateKey)
        break
      case "vault":
        deployMultisig(deployChains, owners, owners.length, privateKey)
        break
    }
  }

  return (
    <SignedIn>
      <div className="flex items-center justify-center relative">
        <div className="absolute top-12 left-0 hidden md:block">
          <a href="/">
            <Button className="" variant="outline">
              <ChevronLeft />
            </Button>
          </a>
        </div>
        <div className="w-full max-w-96 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Create a safe</CardTitle>
              <CardDescription>
                Deploy your new safe in one-click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="framework">Deployment Chains</Label>
                    <div className="flex w-full flex-col gap-5">
                      <MultipleSelector
                        className="z-10"
                        value={selectedChains}
                        onChange={setSelectedChains}
                        defaultOptions={CHAINS}
                        placeholder="Select chains to deploy to..."
                        emptyIndicator={
                          <p className="text-center leading-10 w-full">
                            no more support chains.
                          </p>
                        }
                      />
                    </div>
                  </div>
                  <Tabs
                    defaultValue="single"
                    value={activeTab}
                    onValueChange={(e) => setActiveTab(e)}
                  >
                    <div className="flex flex-col space-y-1.5 w-full">
                      <Label htmlFor="name">Safe Type</Label>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="single">Single</TabsTrigger>
                        <TabsTrigger value="multi">Multi</TabsTrigger>
                        <TabsTrigger value="vault">Vault</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="single"></TabsContent>
                    <TabsContent value="multi">
                      <div className="flex flex-col space-y-1.5 w-full pt-4">
                        <Label>Owners</Label>

                        {owners.map((owner, index) => (
                          <div
                            key={Math.random()}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder="0x..."
                              value={owner}
                              onChange={(e) => {
                                const newOwners = [...owners]
                                newOwners[index] = e.target.value
                                setOwners(newOwners)
                              }}
                            />
                            {index >= 2 && (
                              <Button
                                onClick={() => {
                                  const newOwners = [...owners]
                                  newOwners.splice(index, 1)
                                  setOwners(newOwners)
                                }}
                              >
                                x
                              </Button>
                            )}
                          </div>
                        ))}
                        <Label
                          className="text-xs cursor-pointer text-destructive ml-auto"
                          onClick={() => {
                            if (owners.length < 9) {
                              setOwners([...owners, ""])
                            }
                          }}
                        >
                          + add a new owner
                        </Label>
                      </div>
                      <div className="w-full grid grid-flow-col gap-6 items-center pt-4">
                        <Label htmlFor="treshold-signatures">
                          Threshold Signatures
                        </Label>
                        <div className="flex flex-row items-center justify-end gap-2 w-full">
                          <Input
                            id="treshold-signatures"
                            className="w-9"
                            type="number"
                            value={threshold}
                            onChange={(e) => {
                              const value = e.target.value
                              if (
                                value === "" ||
                                (parseInt(value) > 0 &&
                                  parseInt(value) <= owners.length)
                              ) {
                                setThreshold(parseInt(value))
                              }
                            }}
                          />
                          <span>/</span>
                          <Input
                            id="treshold-signatures"
                            className="w-9"
                            value={owners.length}
                            readOnly
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="vault">
                      <div className="flex flex-col space-y-1.5 w-full pt-4">
                        <Label>Owners</Label>

                        {owners.map((owner, index) => (
                          <div
                            key={Math.random()}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder="0x..."
                              value={owner}
                              onChange={(e) => {
                                const newOwners = [...owners]
                                newOwners[index] = e.target.value
                                setOwners(newOwners)
                              }}
                            />
                            {index >= 2 && (
                              <Button
                                onClick={() => {
                                  const newOwners = [...owners]
                                  newOwners.splice(index, 1)
                                  setOwners(newOwners)
                                }}
                              >
                                x
                              </Button>
                            )}
                          </div>
                        ))}
                        <Label
                          className="text-xs cursor-pointer text-destructive ml-auto"
                          onClick={() => {
                            if (owners.length < 9) {
                              setOwners([...owners, ""])
                            }
                          }}
                        >
                          + add a new owner
                        </Label>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="w-full flex flex-col items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                      <Label htmlFor="social-recovery">Social Recovery</Label>
                      <Switch
                        id="social-recovery"
                        onCheckedChange={(e) => setSocialRecovery(e)}
                      />
                    </div>
                    {socialRecovery && (
                      <div className="flex flex-col space-y-1.5 w-full p-2 m-2 border rounded-md">
                        <div className="grid grid-flow-col items-center justify-between gap-4">
                          <Label htmlFor="recovery-period">
                            Recovery Period
                          </Label>
                          <Input
                            id="recovery-period"
                            type="number"
                            placeholder="in minutes..."
                            value={recoveryPeriod}
                            onChange={(e) =>
                              setRecoveryPeriod(e.target.valueAsNumber)
                            }
                          />
                        </div>
                        <Label>Beneficiaries</Label>
                        {beneficiaries.map((beneficiary, index) => (
                          <div
                            key={Math.random()}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder="0x..."
                              value={beneficiary}
                              onChange={(e) => {
                                const newBeneficiaries = [...beneficiaries]
                                newBeneficiaries[index] = e.target.value
                                setBeneficiaries(newBeneficiaries)
                              }}
                            />
                            {index >= 1 && (
                              <Button
                                onClick={() => {
                                  const newBeneficiaries = [...beneficiaries]
                                  newBeneficiaries.splice(index, 1)
                                  setBeneficiaries(newBeneficiaries)
                                }}
                              >
                                x
                              </Button>
                            )}
                          </div>
                        ))}
                        <Label
                          className="text-xs cursor-pointer text-destructive flex justify-end w-full"
                          onClick={() => {
                            if (beneficiaries.length < 9) {
                              setBeneficiaries([...beneficiaries, ""])
                            }
                          }}
                        >
                          + add a new beneficiary
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={deploy}>
                Deploy
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SignedIn>
  )
}

export default Create
