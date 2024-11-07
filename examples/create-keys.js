// Run from root as `node examples/create-keys.js`
const { EAS } = require('..')

const words = EAS.generateMnemonic()
const privateKey = EAS.getPrivateKeyFromMnemonic(words)
const address = EAS.getAddressFromPrivateKey(privateKey)

console.log('12-words:', words.join(' '))
console.log('Private key:', privateKey)
console.log('Address:', address)
