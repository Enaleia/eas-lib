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
    const timerStart = Date.now()
    const eas = new EAS(providerUrl, privateKey)

    const schema = 'uint256 eventId, string[] weights, string comment'
    const schemaUID = '0x6123441ae23c2a9ef6c0dfa07ac6ad5bb9a7950c4759e4b5989acb05eb87554e'
    const uid = await eas.attest(providerUrl, privateKey, schema, schemaUID, {
      eventId: 314,
      weights: ['W1', 'W2'],
      comment: 'Event-6',
    })
  } catch (error) {
    console.error('Failed to call:', error)
  }
}

main()
