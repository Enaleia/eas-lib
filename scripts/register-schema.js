#! /usr/bin/env node

// Run from root as `node examples/register-complex-schema.js`
const { EAS } = require('..')
const { Command } = require('commander')
const fs = require('fs')

// Make sure to copy the example .env file to the root of the project and fill in the values or this will fail.
// .env: OP_PROVIDER and PRIVATE_KEY
require('dotenv').config()

function getCLIOptions() {
  const program = new Command()
  program.option('-p, --path <path>', 'path to the schema file')
  program.parse(process.argv)
  return program.opts()
}

async function main() {
  const providerUrl = process.env.OP_PROVIDER
  const privateKey = process.env.PRIVATE_KEY
  const options = getCLIOptions()

  if (!options.path) {
    console.error('Schema path is required. Use -p or --path to specify the schema file path.')
    process.exit(1)
  }

  const schema = fs.readFileSync(options.path, 'utf8')

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
