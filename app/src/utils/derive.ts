import CryptoJS from "crypto-js"
import { ethers } from "ethers"

export const deriveKeys = (uid: string | null | undefined) => {
  if (!uid) return {}

  const hashedString = CryptoJS.SHA256(uid).toString()

  const buffer = Buffer.from(hashedString, "hex")

  const privateKey = ethers.hexlify(buffer)

  const address = new ethers.Wallet(privateKey).address

  return { privateKey, address }
}