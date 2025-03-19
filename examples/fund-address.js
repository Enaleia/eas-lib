#! /usr/bin/env node

// Run from root as `node examples/create-keys.js`
const { EAS } = require('..')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
// .env: OP_PROVIDER and PRIVATE_KEY
require('dotenv').config()

async function main() {
  const providerUrl = process.env.OP_PROVIDER
  const privateKey = process.env.PRIVATE_KEY

  try {
    const eas = new EAS(providerUrl, privateKey)
    const address = '0x874628507e34a20FCfa7790E13AaE493D696DB8E'
    const hash = await eas.fundAddress(address, '0.1')
    console.log(`Tx-hash:`, hash)
  } catch (error) {
    console.error('Failed to call:', error)
  }
}

main()
