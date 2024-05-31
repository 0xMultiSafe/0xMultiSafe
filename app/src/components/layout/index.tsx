import { FC, ReactNode } from "react"
import Dashboard from "../prebuilt/dashboard"

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return <Dashboard>{children}</Dashboard>
}

export default Layout
