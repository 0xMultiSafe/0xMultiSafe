import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import { parseEther } from 'viem'

describe('Multisig', function () {
  async function deployMultisigFixture() {
    const [owner, otherOwner, anotherOwner, nonOwner] =
      await hre.viem.getWalletClients()
    const owners = [
      owner.account.address,
      otherOwner.account.address,
      anotherOwner.account.address,
    ]
    const required = 2n

    const multisig = await hre.viem.deployContract(
      'Multisig',
      [owners, required],
      {
        value: parseEther('2'),
      }
    )

    const token = await hre.viem.deployContract('Token')

    const publicClient = await hre.viem.getPublicClient()

    return {
      multisig,
      token,
      owners,
      required,
      owner,
      otherOwner,
      anotherOwner,
      nonOwner,
      publicClient,
    }
  }

  describe('Deployment', function () {
    it('Should set the right owners and required confirmations', async function () {
      const { multisig, owners, required } = await loadFixture(
        deployMultisigFixture
      )

      for (let i = 0; i < owners.length; i++) {
        expect(await multisig.read.isOwner([owners[i]])).to.be.true
      }
      expect(await multisig.read.required()).to.equal(required)
    })
  })

  describe('Transactions', function () {
    it('Should allow owners to submit transactions', async function () {
      const { multisig, owner } = await loadFixture(deployMultisigFixture)

      await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )

      const transactionCount = await multisig.read.transactionCount()
      expect(transactionCount).to.equal(1n)

      const transaction = await multisig.read.transactions([0n])
      expect(transaction[0].toLowerCase()).to.equal(owner.account.address)
      expect(transaction[1].toLowerCase()).to.equal(multisig.address)
      expect(transaction[2]).to.equal(parseEther('1'))
      expect(transaction[3]).to.equal('0x')
      expect(transaction[4]).to.be.false
      expect(transaction[5]).to.equal(0n)
    })

    it('Should allow owners to confirm transactions', async function () {
      const { multisig, owner } = await loadFixture(deployMultisigFixture)

      await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )
      await multisig.write.confirmTransaction([0n], { account: owner.account })

      const isConfirmed = await multisig.read.isConfirmed([
        0n,
        owner.account.address,
      ])
      expect(isConfirmed).to.be.true
    })

    it('Should not allow non-owners to submit transactions', async function () {
      const { multisig, nonOwner } = await loadFixture(deployMultisigFixture)

      await expect(
        multisig.write.submitTransaction(
          [nonOwner.account.address, multisig.address, parseEther('1'), '0x'],
          { account: nonOwner.account }
        )
      ).to.be.rejectedWith('Not owner')
    })

    it('Should not allow non-owners to confirm transactions', async function () {
      const { multisig, owner, nonOwner } = await loadFixture(
        deployMultisigFixture
      )

      await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )

      await expect(
        multisig.write.confirmTransaction([0n], { account: nonOwner.account })
      ).to.be.rejectedWith('Not owner')
    })

    it('Should execute a transaction when the required confirmations are met', async function () {
      const { multisig, owner, otherOwner, publicClient } = await loadFixture(
        deployMultisigFixture
      )

      await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )
      await multisig.write.confirmTransaction([0n], { account: owner.account })

      const balanceBefore = await publicClient.getBalance({
        address: owner.account.address,
      })

      await multisig.write.confirmTransaction([0n], {
        account: otherOwner.account,
      })

      const transaction = await multisig.read.transactions([0n])
      expect(transaction[4]).to.be.true

      const balanceAfter = await publicClient.getBalance({
        address: owner.account.address,
      })
      expect(balanceAfter - balanceBefore).to.equal(parseEther('1'))
    })

    it('Should not execute a transaction with insufficient confirmations', async function () {
      const { multisig, owner } = await loadFixture(deployMultisigFixture)

      await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )
      await multisig.write.confirmTransaction([0n], { account: owner.account })

      const transaction = await multisig.read.transactions([0n])
      expect(transaction[4]).to.be.false
    })

    it('Should emit events on transaction submission, confirmation, and execution', async function () {
      const { multisig, owner, otherOwner, publicClient } = await loadFixture(
        deployMultisigFixture
      )

      const submitTxHash = await multisig.write.submitTransaction(
        [owner.account.address, multisig.address, parseEther('1'), '0x'],
        { account: owner.account }
      )
      await publicClient.waitForTransactionReceipt({ hash: submitTxHash })

      const submitEvents = await multisig.getEvents.TransactionSubmitted()
      expect(submitEvents).to.have.lengthOf(1)

      const confirmTxHash = await multisig.write.confirmTransaction([0n], {
        account: owner.account,
      })
      await publicClient.waitForTransactionReceipt({ hash: confirmTxHash })

      const confirmEvents = await multisig.getEvents.TransactionConfirmed()
      expect(confirmEvents).to.have.lengthOf(1)

      const confirmTxHash2 = await multisig.write.confirmTransaction([0n], {
        account: otherOwner.account,
      })
      await publicClient.waitForTransactionReceipt({ hash: confirmTxHash2 })

      const confirm2Events = await multisig.getEvents.TransactionConfirmed()
      expect(confirm2Events).to.have.lengthOf(1)

      const executeEvents = await multisig.getEvents.TransactionExecuted()
      expect(executeEvents).to.have.lengthOf(1)
    })
  })
})
