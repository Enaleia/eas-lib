// Run from root as `node examples/register-schema.js`
const { EAS } = require('..')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
require('dotenv').config()

async function main() {
  const providerUrl = process.env.OP_PROVIDER
  const privateKey = process.env.PRIVATE_KEY

  // Registering the same schema twice will fail.
  const schema =
    'string userID, string portOrCompanyName, string[] portOrCompanyCoordinates,' +
    'string actionType, string actionDate, string[] actionCoordinates, string collectorName,' +
    'string[] incomingMaterials, uint256[] incomingWeightsKg, string[] incomingCodes,' +
    'string[] outgoingMaterials,  uint256[] outgoingWeightsKg, string[] outgoingCodes, ' +
    'string productName, uint256 batchQuantity, string weightPerItemKg'

  try {
    const timerStart = Date.now()
    const eas = new EAS(providerUrl, privateKey)
    const schemaUID = await eas.registerSchema(schema)
    console.log(`eas.registerSchema took ${Date.now() - timerStart} ms`)
    console.log('Schema registered successfully. Schema UID:', schemaUID)
  } catch (error) {
    console.error('Failed to register schema:', error)
  }
}

main()
