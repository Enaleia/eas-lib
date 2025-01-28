const bip39 = require('bip39')
const { Wallet, ethers } = require('ethers')
const { EAS, SchemaEncoder, SchemaRegistry } = require('@ethereum-attestation-service/eas-sdk')

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
   */
  constructor(providerUrl, privateKey) {
    this.providerUrl = providerUrl
    this.privateKey = privateKey
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
   * @param {string} schema - The schema definition string.
   * @returns {Promise<string>} - The transaction hash of the schema registration.
   */
  async registerSchema(schema) {
    // Signer
    const provider = new ethers.JsonRpcProvider(this.providerUrl)
    const signer = new ethers.Wallet(this.privateKey, provider)

    // Registry
    const schemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_CONTRACT_ADDRESS)
    schemaRegistry.connect(signer)

    // Register schema
    const tx = await schemaRegistry.register({
      schema,
      resolverAddress: '0x0000000000000000000000000000000000000000', // No resolver by default!
      revocable: true,
    })

    const schemaUID = await tx.wait()
    return schemaUID
  }
}

module.exports = { EASHelper }
