/**
 * Class containing methods to work with the EAS protocol.
 */
export class EASHelper {
  /**
   * @param {string} providerUrl - The RPC URL of the Ethereum provider.
   * @param {string} privateKey - The private key of the wallet that will deploy the schema or send/get attestations.
   */
  constructor(providerUrl?: string, privateKey?: string)

  /**
   * Generates a 12-word mnemonic phrase (128 bits of entropy).
   *
   * @returns {string[]} A string array containing 12-word mnemonic phrase.
   */
  static generateMnemonic(): string[]
  /**
   * Generates an Ethereum private key from a 12-word mnemonic phrase.
   *
   * @param {string[]} mnemonic - A string array containing 12-word mnemonic phrase.
   * @returns {string} - The corresponding Ethereum private key (hex string).
   */
  static getPrivateKeyFromMnemonic(mnemonic: string[]): string
  /**
   * Derives the Ethereum address from a private key.
   *
   * @param {string} privateKey - The Ethereum private key (hex string).
   * @returns {string} - The corresponding Ethereum address.
   */
  static getAddressFromPrivateKey(privateKey: string): string
  /**
   * Register an EAS schema with the EAS registry.
   *
   * @param {string} schema - The schema definition string.
   * @returns {Promise<string>} - The transaction hash of the schema registration.
   */
  registerSchema(schema: string): Promise<string>
}
