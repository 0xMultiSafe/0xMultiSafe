// PREBUILT FROM https://ui.shadcn.com/blocks#dashboard-03

"use client"

import {
  ArrowUpDown,
  Book,
  Bot,
  CircleUserRound,
  Code2,
  FileClock,
  LayoutGrid,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FC, ReactNode, useEffect } from "react"
import {
  SignedOut,
  SignInButton,
  SignedIn,
  useClerk,
  useAuth,
} from "@clerk/nextjs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { usePathname } from "next/navigation"
import { deriveKeys } from "@/utils/derive"
import { shortenAddress } from "@/utils/format"
import { copy } from "@/utils/copy"
import { faucetDrip } from "@/utils/faucet"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
}

const Dashboard: FC<Props> = ({ children }) => {
  const { signOut } = useClerk()
  const { userId } = useAuth()

  const { address, privateKey } = deriveKeys(userId)

  const pathnames = usePathname()
    .split("/")
    .filter((pathname) => pathname !== "")

  pathnames.unshift("multisig")

  useEffect(() => {
    if (!address || !privateKey) return undefined

    faucetDrip(address)
  }, [address, privateKey])

  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <a href="/">
            <Button variant="outline" size="icon" aria-label="Home">
              <Triangle className="size-5 fill-foreground" />
            </Button>
          </a>
        </div>
        {pathnames.length > 2 && (
          <nav className="grid gap-1 p-2">
            <a href={`/${pathnames[1]}/dashboard`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg`, {
                  [`bg-muted`]: pathnames[2] === "dashboard",
                })}
                aria-label="dashboard"
              >
                <LayoutGrid className="size-5" />
              </Button>
            </a>
            <a href={`/${pathnames[1]}/transaction`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg`, {
                  [`bg-muted`]: pathnames[2] === "transaction",
                })}
                aria-label="transaction"
              >
                <ArrowUpDown className="size-5" />
              </Button>
            </a>
            <a href={`/${pathnames[1]}/pending`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg`, {
                  [`bg-muted`]: pathnames[2] === "pending",
                })}
                aria-label="pending"
              >
                <FileClock className="size-5" />
              </Button>
            </a>
            <a href={`/${pathnames[1]}/recover`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg`, {
                  [`bg-muted`]: pathnames[2] === "recover",
                })}
                aria-label="recover"
              >
                <LifeBuoy className="size-5" />
              </Button>
            </a>
            <a href={`/${pathnames[1]}/settings`}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(`rounded-lg`, {
                  [`bg-muted`]: pathnames[2] === "settings",
                })}
                aria-label="settings"
              >
                <Settings2 className="size-5" />
              </Button>
            </a>
          </nav>
        )}
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">
            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.map((path, i) => {
                  const paths = pathnames.map((path) =>
                    path.replace(/multisig/g, "")
                  )
                  const route = `${paths.slice(0, i + 1).join("/")}`
                  return (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={route === "" ? "/" : route}>
                          {path}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {i < pathnames.length - 1 && <BreadcrumbSeparator />}
                    </>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </h1>
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="ml-auto gap-1.5 text-sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="ml-auto flex gap-2">
              {address && (
                <Button
                  className="gap-1.5 text-sm"
                  variant="outline"
                  size="sm"
                  onClick={() => copy(address)}
                >
                  <div className="inline-block mr-2 animate-pulse bg-green-500 rounded-full h-2 w-2"></div>
                  {shortenAddress(address)}
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="text-sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </SignedIn>
        </header>
        {/* className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3" */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default Dashboard
