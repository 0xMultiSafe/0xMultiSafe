import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import Layout from "@/components/layout"
import { Toaster } from '@/components/ui/sonner'

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "0xMultiSafe",
  description: "The Cross-Chain, Account-Abstracted Multisig Wallet, The Upgraded Gnosis Safe.",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            bricolageGrotesque.className
          )}
        >
          <Toaster />
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout
