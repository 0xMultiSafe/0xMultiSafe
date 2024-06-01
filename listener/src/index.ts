import { neonNeonTransactionWeb3 } from "@neonevm/token-transfer"
import Web3 from "web3"
import { PublicKey  } from "@solana/web3.js"
import { Account, TransactionConfig } from "web3-core"
import "dotenv/config"
;(async () => {
    async function sendSignedTransaction(
        web3: Web3,
        transaction: TransactionConfig,
        account: Account
    ): Promise<string> {
        const signedTrx = await web3.eth.accounts.signTransaction(
            transaction,
            account.privateKey
        )
        return new Promise((resolve, reject) => {
            if (signedTrx?.rawTransaction) {
                web3.eth.sendSignedTransaction(
                    signedTrx.rawTransaction,
                    (error, hash) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(hash)
                        }
                    }
                )
            } else {
                reject("Unknown transaction")
            }
        })
    }

    const networkUrl = {
        neonProxy: "https://devnet.neonevm.org",
        solana: "https://api.devnet.solana.com",
    }
    const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl.neonProxy))
    const NEON_PRIVATE = process.env["NEON_PRIVATE"]!

    const neonWallet = web3.eth.accounts.privateKeyToAccount(NEON_PRIVATE)
    // const solanaWallet = Keypair.fromSecretKey(decode(SOLANA_PRIVATE))
    const solanaWallet = new PublicKey(
      "56i17KWd1uJCn2kCd8b72uwwryH5oswQ3dc4dJNDquVP",
    );
    
    const NEON_TRANSFER_CONTRACT_DEVNET =
        "0x5238c694a8db837fff8c4068859e765b978a7607"

    const amount = "0.1"
    const tokenContract = NEON_TRANSFER_CONTRACT_DEVNET
    const transaction = await neonNeonTransactionWeb3(
        web3,
        neonWallet.address,
        tokenContract,
        solanaWallet,
        amount
    )
    const hash = await sendSignedTransaction(web3, transaction, neonWallet)
    console.log("Transaction hash:", hash)
})()
