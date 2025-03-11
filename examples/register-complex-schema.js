#! /usr/bin/env node

// Run from root as `node examples/register-complex-schema.js`
const { EAS } = require('..')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
// .env: OP_PROVIDER and PRIVATE_KEY
require('dotenv').config()

async function main() {
  const providerUrl = process.env.OP_PROVIDER
  const privateKey = process.env.PRIVATE_KEY

  // Registering the same schema twice will fail.
  const schema =
    'string userID, string portOrCompanyName, uint64[] portOrCompanyCoordinates,' +
    'string actionType, string actionDate, uint64[] actionCoordinates, string collectorName,' +
    'string[] incomingMaterials, uint64[] incomingWeightsKg, string[] incomingCodes,' +
    'string[] outgoingMaterials, uint64[] outgoingWeightsKg, string[] outgoingCodes, ' +
    'string productName, uint64 batchQuantity, uint64 weightPerItemKg';

  try {
    const timerStart = Date.now()
    const eas = new EAS(providerUrl, privateKey, schema)
    const schemaUID = await eas.registerSchema()
    console.log(`eas.registerSchema took ${Date.now() - timerStart} ms`)
    console.log('Schema registered successfully. Schema UID:', schemaUID)
  } catch (error) {
    console.error('Failed to register schema:', error)
  }
}

main()
