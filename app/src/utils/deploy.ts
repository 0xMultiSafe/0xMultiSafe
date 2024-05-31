import { ethers } from 'ethers'

export const deployMultisig = async () => {
  const create2DeployerABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'salt',
          type: 'uint256',
        },
      ],
      name: 'Deployed',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'bytes',
          name: '_bytecode',
          type: 'bytes',
        },
        {
          internalType: 'uint256',
          name: '_salt',
          type: 'uint256',
        },
      ],
      name: 'deployUsingCreate2',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address[]',
          name: '_owners',
          type: 'address[]',
        },
        {
          internalType: 'uint256',
          name: '_required',
          type: 'uint256',
        },
      ],
      name: 'getBytecode',
      outputs: [
        {
          internalType: 'bytes',
          name: '',
          type: 'bytes',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes',
          name: '_bytecode',
          type: 'bytes',
        },
        {
          internalType: 'uint256',
          name: '_salt',
          type: 'uint256',
        },
      ],
      name: 'getDeploymentAddress',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ] // ABI of Create2Deployer contract

  // Address of deployed Create2Deployer contract
  const create2DeployerAddress = '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707' // Address of deployed Create2Deployer contract

  // Parameters for Multisig constructor
  const owners = ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'] // Array of owner addresses
  const required = BigInt(1) // Number of required confirmations

  // Connect to Ethereum network
  const provider = new ethers.BrowserProvider(window.ethereum)

  // Instantiate Create2Deployer contract
  const create2DeployerContract = new ethers.Contract(
    create2DeployerAddress,
    create2DeployerABI,
    await provider.getSigner()
  )

  // Call getBytecode function of Create2Deployer contract
  const bytecode = await create2DeployerContract.getBytecode(owners, required)

  console.log('Bytecode:', bytecode)
  const address = await create2DeployerContract.getDeploymentAddress(
    bytecode,
    '123'
  )
  console.log('deployment address:', address)

  const tx = await create2DeployerContract.deployUsingCreate2(
    bytecode,
    '123'
  )

  console.log('Transaction:', tx)
}
