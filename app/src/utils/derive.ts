import CryptoJS from 'crypto-js'
import { ethers } from 'ethers'

export const deriveEthereumPrivateKey = (
  email: string,
  masterPassword: string
) => {
  const hashedString = CryptoJS.SHA256(email + masterPassword).toString()

  const buffer = Buffer.from(hashedString, 'hex')

  return ethers.hexlify(buffer)
}
