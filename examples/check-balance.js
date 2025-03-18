#! /usr/bin/env node

// Run from root as `node examples/create-keys.js`
const { EAS } = require('..')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
// .env: OP_PROVIDER and PRIVATE_KEY
require('dotenv').config()

async function main() {
  const providerUrl = process.env.OP_PROVIDER

  try {
    const eas = new EAS(providerUrl)
    const address = '0x27ab7feba2CD82b5ab79a4867b19EdA884337a1c'
    const balance = await eas.getBalance(address)
    console.log(`Balance of address ${address}:`, balance)
  } catch (error) {
    console.error('Failed to call:', error)
  }
}

main()
