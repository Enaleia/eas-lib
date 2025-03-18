const bip39 = require('bip39')
const { Wallet, ethers } = require('ethers')
const {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
  NO_EXPIRATION,
} = require('@ethereum-attestation-service/eas-sdk')

// The EAS contract addresses are valid for both OP Mainnet and Sepolia.
const SCHEMA_REGISTRY_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000020'
const ATTESTATION_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021'

/**
 * Class containing methods to work with the EAS protocol.
 */
class EASHelper {
  /**
   * @param {string} providerUrl - The RPC URL of the Ethereum provider.
   * @param {string} privateKey - The private key of the wallet that will deploy the schema or send/get attestations.
   * @param {string} schema - The schema definition string.
   * @param {string} schemaUID - The schema UID.
   */
  constructor(providerUrl, privateKey, schema, schemaUID) {
    this.providerUrl = providerUrl
    this.provider = new ethers.JsonRpcProvider(providerUrl)

    this.privateKey = privateKey
    this.schema = schema
    this.schemaUID = schemaUID
  }

  /**
   * Generates a 12-word mnemonic phrase (128 bits of entropy).
   *
   * @returns {string[]} A string array containing 12-word mnemonic phrase.
   */
  static generateMnemonic() {
    return bip39.generateMnemonic(128).split(' ')
  }

  /**
   * Generates an Ethereum private key from a 12-word mnemonic phrase.
   *
   * @param {string[]} mnemonic - A string array containing 12-word mnemonic phrase.
   * @returns {string} - The corresponding Ethereum private key (hex string).
   */
  static getPrivateKeyFromMnemonic(mnemonic) {
    if (!Array.isArray(mnemonic)) {
      console.log(`getPrivateKeyFromMnemonic: mnemonic must be an array of words.`)
      return null
    }
    if (mnemonic.length !== 12) {
      console.log(`getPrivateKeyFromMnemonic: mnemonic must be a 12-word phrase.`)
      return null
    }

    try {
      // Use standard Ethereum path m/44'/60'/0'/0/0 for Optimism.
      const derivationPath = "m/44'/60'/0'/0/0"

      // Derive private key from mnemonic.
      const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic.join(' '))
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, derivationPath)

      return wallet.privateKey
    } catch (error) {
      console.log(`getPrivateKeyFromMnemonic: error when generating private key: ${error.message}`)
      return null
    }
  }

  /**
   * Derives the Ethereum address from a private key.
   *
   * @param {string} privateKey - The Ethereum private key (hex string).
   * @returns {string} - The corresponding Ethereum address.
   */
  static getAddressFromPrivateKey(privateKey) {
    try {
      if (!privateKey.startsWith('0x')) {
        privateKey = '0x' + privateKey
      }

      const wallet = new Wallet(privateKey)
      return wallet.address
    } catch (error) {
      console.log(`getAddressFromPrivateKey: error when deriving address: ${error.message}`)
      return null
    }
  }

  /**
   * Register an EAS schema with the EAS registry.
   *
   * Possible failure reasons:
   * - Invalid schema definition.
   * - Similar schema definition already exists.
   * - Insufficient gas.
   * - Network connectivity issues.
   * - Invalid private key.
   * - Invalid provider URL.
   *
   * @returns {Promise<string>} - The transaction hash of the schema registration.
   */
  async registerSchema() {
    // Signer
    const signer = new ethers.Wallet(this.privateKey, this.provider)

    // Registry
    const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_CONTRACT_ADDRESS)
    schemaRegistry.connect(signer)

    // Register schema
    const tx = await schemaRegistry.register({
      schema: this.schema,
      resolverAddress: '0x0000000000000000000000000000000000000000', // No resolver by default!
      revocable: true,
    })

    const schemaUID = await tx.wait()
    return schemaUID
  }

  /**
   * Split the EAS schema string into types and keys.
   * Examples EAS schema: 'uint256 eventId, string[] weights, string comment'
   *
   * @param {string} schema - The EAS schema definition string.
   * @returns {object} - An object containing types and keys.
   */
  static getSchemaTypesAndKeys(schema) {
    const types = {}
    const keys = new Set()
    const schemaParts = schema.split(',').map((part) => part.trim())
    for (const schemaPart of schemaParts) {
      const [type, key] = schemaPart.split(' ')
      types[key] = type
      keys.add(key)
    }
    return { types, keys }
  }

  /**
   * Validate the data against the EAS schema.
   *
   * @param {string} schema - The EAS schema definition string.
   * @param {object} data - The data to be validated.
   * @returns {object} - An object containing the validation status and message.
   */
  static validateSchemaData(schema, data) {
    const { keys } = EASHelper.getSchemaTypesAndKeys(schema)

    let missingKeys = []
    for (const key of keys) {
      if (!(key in data)) missingKeys.push(key)
    }

    if (missingKeys.length > 0) {
      return { status: false, missingKeys }
    }

    return { status: true }
  }

  /**
   * Cast the data types according to the EAS schema.
   *
   * @param {string} schema - The EAS schema definition string.
   * @param {object} data - The data to be casted.
   */
  static castSchemaDataTypes(schema, data) {
    const schemaParts = schema.split(',').map((part) => part.trim())
    for (const schemaPart of schemaParts) {
      const [type, key] = schemaPart.split(' ')
      if (type === 'int') {
        data[key] = parseInt(data[key])
      } else if (type === 'int[]') {
        data[key] = data[key].map((item) => parseInt(item))
      }
    }
  }

  /**
   * Publish data to the EAS attestation contract.
   *
   * @param {object} data - The data to be attested.
   * @returns {Promise<string>} - The UID of the new attestation.
   */
  async attest(data) {
    const easContractAddress = '0x4200000000000000000000000000000000000021'
    const eas = new EAS(easContractAddress)

    // Initialize signer.
    const signer = new ethers.Wallet(this.privateKey, this.provider)

    // Signer must be an ethers-like signer.
    await eas.connect(signer)

    // Prepare data for encoding.
    const { types: schemaTypes } = EASHelper.getSchemaTypesAndKeys(this.schema)
    const schemaData = []
    for (const [name, value] of Object.entries(data)) {
      schemaData.push({ name, value, type: schemaTypes[name] })
    }

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(this.schema)
    const encodedData = schemaEncoder.encodeData(schemaData)

    const tx = await eas.attest({
      schema: this.schemaUID,
      data: {
        recipient: '0x0000000000000000000000000000000000000000',
        expirationTime: NO_EXPIRATION,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    })
    const newAttestationUID = await tx.wait()
    return newAttestationUID
  }

  /**
   * Get the balance of an Ethereum address.
   *
   * @param {string} address - The Ethereum address.
   * @returns {Promise<string>} - The balance of the address.
   */
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.log(`getBalance: error when getting balance: ${error.message}`)
      return null
    }
  }

  /**
   * Fund an Ethereum address with some ethers.
   *
   * @param {string} recipientAddress - The Ethereum address to fund.
   * @param {string} amount - The amount of ether to send (in ether units).
   * @returns {Promise<string>} - The transaction hash of the funding transaction.
   */
  async fundAddress(recipientAddress, amount) {
    try {
      console.log('f00', ethers.Wallet)
      const signer = new ethers.Wallet(this.privateKey, this.provider)
      console.log('f0:', signer)
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      })
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.log(`fundAddress: error when funding address: ${error.message}`)
      return null
    }
  }
}

module.exports = { EASHelper }
