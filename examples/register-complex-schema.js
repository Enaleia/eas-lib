// Run from root as `node examples/register-schema.js`
const { EAS } = require('..')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
require('dotenv').config()

async function main() {
  const providerUrl = process.env.OP_PROVIDER
  const privateKey = process.env.PRIVATE_KEY

  // Registering the same schema twice will fail.
  const schema =
    'string userId, string companyName, string companyCoordinates,' +
    'string eventTimestamp, string[] eventCoordinates, string actionName,' +
    'string collectorName, string[] inputIdentifier, string[] inputMaterial,' +
    'uint256[] inputWeight, string[] outputIdentifier, string[] outputMaterial,' +
    'uint256[] outputWeight, string productName, uint256 batchQuantity'

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
