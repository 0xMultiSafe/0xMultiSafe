// PREBUILT FROM https://ui.shadcn.com/blocks#dashboard-03

"use client"

import {
  Book,
  Bot,
  CircleUserRound,
  Code2,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FC, ReactNode } from "react"
import { SignedOut, SignInButton, SignedIn, useClerk } from "@clerk/nextjs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { usePathname } from "next/navigation"

interface Props {
  children: ReactNode
}

const Dashboard: FC<Props> = ({ children }) => {
  const { signOut } = useClerk()
  const pathnames = usePathname()
    .split("/")
    .filter((pathname) => pathname !== "")

  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg bg-muted"
            aria-label="Playground"
          >
            <SquareTerminal className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            aria-label="Models"
          >
            <Bot className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            aria-label="API"
          >
            <Code2 className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            aria-label="Documentation"
          >
            <Book className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            aria-label="Settings"
          >
            <Settings2 className="size-5" />
          </Button>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto rounded-lg"
            aria-label="Help"
          >
            <LifeBuoy className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto rounded-lg"
            aria-label="Account"
          >
            <SquareUser className="size-5" />
          </Button>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">
            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.map((path, i) => {
                  path = path === "" ? "Home" : path
                  const route = `/${pathnames.slice(0, i + 1).join("/")}`
                  return (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={route}>{path}</BreadcrumbLink>
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
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto gap-1.5 text-sm hover:bg-destructive hover:text-destructive-foreground transition-all"
              onClick={() => signOut()}
            >
              <CircleUserRound className="size-4" />
              Logged In
            </Button>
          </SignedIn>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
