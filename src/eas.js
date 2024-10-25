import * as bip39 from 'bip39'
import { Wallet, ethers } from 'ethers'

/**
 * Class containing methods to work with the EAS protocol.
 */
class EAS {
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
    try {
      if (!Array.isArray(mnemonic)) {
        throw new Error('Mnemonic must be an array of words.')
      }
      if (mnemonic.length !== 12) {
        throw new Error('Mnemonic must be a 12-word phrase.')
      }

      // Use standard Ethereum path m/44'/60'/0'/0/0 for Optimism.
      const derivationPath = "m/44'/60'/0'/0/0"

      // Derive private key from mnemonic.
      const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic.join(' '))
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, derivationPath)

      return wallet.privateKey
    } catch (error) {
      console.error('Error generating private key:', error.message)
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
      console.error('Error deriving address:', error.message)
      return null
    }
  }
}

export { EAS as default }
