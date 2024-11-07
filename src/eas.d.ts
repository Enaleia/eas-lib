/**
 * Class containing methods to work with the EAS protocol.
 */
export class EAS {
    /**
     * Generates a 12-word mnemonic phrase (128 bits of entropy).
     *
     * @returns {string[]} A string array containing 12-word mnemonic phrase.
     */
    static generateMnemonic(): string[];
    /**
     * Generates an Ethereum private key from a 12-word mnemonic phrase.
     *
     * @param {string[]} mnemonic - A string array containing 12-word mnemonic phrase.
     * @returns {string} - The corresponding Ethereum private key (hex string).
     */
    static getPrivateKeyFromMnemonic(mnemonic: string[]): string;
    /**
     * Derives the Ethereum address from a private key.
     *
     * @param {string} privateKey - The Ethereum private key (hex string).
     * @returns {string} - The corresponding Ethereum address.
     */
    static getAddressFromPrivateKey(privateKey: string): string;
}
