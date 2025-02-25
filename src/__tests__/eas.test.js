const { expect } = require('chai')
const { EASHelper: EAS } = require('../eas')

describe('EAS', () => {
  describe('generateMnemonic', () => {
    it('should generate a 12-word mnemonic phrase', () => {
      const mnemonic = EAS.generateMnemonic()
      expect(mnemonic).to.be.an('array')
      expect(mnemonic).to.have.lengthOf(12)
    })
  })

  describe('getPrivateKeyFromMnemonic', () => {
    it('should generate a private key from a valid 12-word mnemonic', () => {
      const mnemonic = EAS.generateMnemonic()
      const privateKey = EAS.getPrivateKeyFromMnemonic(mnemonic)
      expect(privateKey).to.be.a('string')
      expect(privateKey).to.match(/^0x[a-fA-F0-9]{64}$/)
    })

    it('should return null for an invalid mnemonic', () => {
      const invalidMnemonic = ['invalid', 'mnemonic', 'phrase']
      const privateKey = EAS.getPrivateKeyFromMnemonic(invalidMnemonic)
      expect(privateKey).to.be.null
    })

    it('should return null for a non-array mnemonic', () => {
      const nonArrayMnemonic = 'not an array'
      const privateKey = EAS.getPrivateKeyFromMnemonic(nonArrayMnemonic)
      expect(privateKey).to.be.null
    })

    it('should return null for a mnemonic with less than 12 words', () => {
      const shortMnemonic = ['word1', 'word2', 'word3']
      const privateKey = EAS.getPrivateKeyFromMnemonic(shortMnemonic)
      expect(privateKey).to.be.null
    })
  })

  describe('getAddressFromPrivateKey', () => {
    it('should derive an address from a valid private key', () => {
      const mnemonic = EAS.generateMnemonic()
      const privateKey = EAS.getPrivateKeyFromMnemonic(mnemonic)
      const address = EAS.getAddressFromPrivateKey(privateKey)
      expect(address).to.be.a('string')
      expect(address).to.match(/^0x[a-fA-F0-9]{40}$/)
    })

    it('should return null for an invalid private key', () => {
      const invalidPrivateKey = 'invalidPrivateKey'
      const address = EAS.getAddressFromPrivateKey(invalidPrivateKey)
      expect(address).to.be.null
    })
  })

  describe('Check derivation from a known mnemonic', () => {
    it('should derive the correct private key and address', () => {
      const mnemonic =
        'tribe arm stock armed bridge useful tray shield scatter begin shiver mystery'.split(' ')
      const privateKey = EAS.getPrivateKeyFromMnemonic(mnemonic)
      const address = EAS.getAddressFromPrivateKey(privateKey)

      expect(privateKey).to.equal(
        '0xf7ac167c96b9cfd930448e8078254bf1e7dd54b31935ae2cbb488a4f584fa97d'
      )
      expect(address).to.equal('0x157FB2D82Cbb6EF9911a78496671a9AC3589d383')
    })
  })
})

describe('EASHelper', () => {
  describe('getSchemaTypesAndKeys', () => {
    it('should split the schema string into types and keys', () => {
      const schema = 'uint256 eventId, string[] weights, string comment'
      const result = EAS.getSchemaTypesAndKeys(schema)
      expect(result).to.deep.equal({
        types: {
          eventId: 'uint256',
          weights: 'string[]',
          comment: 'string',
        },
        keys: new Set(['eventId', 'weights', 'comment']),
      })
    })
  })

  describe('validateSchemaData', () => {
    it('should validate data against the schema and return true if all keys are present', () => {
      const schema = 'uint256 eventId, string[] weights, string comment'
      const data = {
        eventId: 1,
        weights: ['1', '2'],
        comment: 'test',
      }
      const result = EAS.validateSchemaData(schema, data)
      expect(result).to.deep.equal({ status: true })
    })

    it('should return false and list missing keys if data is missing keys', () => {
      const schema = 'uint256 eventId, string[] weights, string comment'
      const data = {
        eventId: 1,
        comment: 'test',
      }
      const result = EAS.validateSchemaData(schema, data)
      expect(result).to.deep.equal({ status: false, missingKeys: ['weights'] })
    })

    it('should validate data against the schema and return true for they keys with empty strings or arrays', () => {
      const schema = 'uint256 eventId, string[] weights, string comment'
      const data = {
        eventId: 1,
        weights: [],
        comment: '',
      }
      const result = EAS.validateSchemaData(schema, data)
      expect(result).to.deep.equal({ status: true })
    })
  })

  describe('castSchemaDataTypes', () => {
    it('should cast data types according to the schema', () => {
      const schema = 'int eventId, int[] weights'
      const data = {
        eventId: '1',
        weights: ['1', '2', '3'],
      }
      EAS.castSchemaDataTypes(schema, data)
      expect(data).to.deep.equal({
        eventId: 1,
        weights: [1, 2, 3],
      })
    })
  })
})
