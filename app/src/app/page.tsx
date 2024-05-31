import { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <div className="">
      <h1>Add all my multi-sigs here + button to create a multisig</h1>
      <a href="/create">Create Multisig</a>
      <a href="/0/dashboard">View Multisig</a>
    </div>
  )
}

export default Home
