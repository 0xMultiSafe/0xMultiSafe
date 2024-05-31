import type { Metadata } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="manifest" href="/manifest.json" />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          bricolageGrotesque.className
        )}
      >
        {children}
      </body>
    </html>
  )
}

export default RootLayout
