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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SignedIn } from "@clerk/nextjs"
import { ArrowBigLeft, ChevronLeft, MoveLeft } from "lucide-react"
import { NextPage } from "next"
import MultipleSelector, { Option } from "@/components/ui/multiple-selector"
import { useState } from "react"

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

  const [value, setValue] = useState<Option[]>([])

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
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-full">
                    <Label htmlFor="framework">Framework</Label>
                    <div className="flex w-full flex-col gap-5">
                      <MultipleSelector
                      className="z-10"
                        value={value}
                        onChange={setValue}
                        defaultOptions={OPTIONS}
                        placeholder="Select frameworks you like..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 w-full">
                            no results found.
                          </p>
                        }
                      />
                    </div>
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
