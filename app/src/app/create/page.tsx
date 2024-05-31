import { SignedIn } from '@clerk/nextjs'
import { NextPage } from 'next'

const Create: NextPage = () => {
  return (
    <SignedIn>
      Create here
    </SignedIn>
  )
}

export default Create