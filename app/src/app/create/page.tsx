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
import { SignedIn } from "@clerk/nextjs"
import { ChevronLeft } from "lucide-react"
import { NextPage } from "next"
import MultipleSelector, { Option } from "@/components/ui/multiple-selector"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { Switch } from "@/components/ui/switch"

const Create: NextPage = () => {
  const OPTIONS: Option[] = [
    { label: "nextjs", value: "Nextjs" },
    { label: "React", value: "react" },
    { label: "Remix", value: "remix" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember" },
    { label: "Gatsby", value: "gatsby" },
    { label: "Astro", value: "astro" },
  ]

  const [threshold, setThreshold] = useState(1)

  const [value, setValue] = useState<Option[]>([])
  const [owners, setOwners] = useState<string[]>(["", ""])

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
                        value={value}
                        onChange={setValue}
                        defaultOptions={OPTIONS}
                        placeholder="Select chains to deploy to..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 w-full">
                            no results found.
                          </p>
                        }
                      />
                    </div>
                  </div>
                  <Tabs defaultValue="single">
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
                    <TabsContent value="vault">Vault Members</TabsContent>
                  </Tabs>
                  <div className="w-full flex items-center justify-between">
                    <Label htmlFor="social-recovery">Social Recovery</Label>
                    <Switch id="social-recovery" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Deploy</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SignedIn>
  )
}

export default Create
