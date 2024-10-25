import EAS from './src/eas.js'

const words = EAS.generateMnemonic()
console.log(words.join(' '))

const privateKey = EAS.getPrivateKeyFromMnemonic(words)
console.log(EAS.getPrivateKeyFromMnemonic(words))

const address = EAS.getAddressFromPrivateKey(privateKey)
console.log(address)
