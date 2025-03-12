# EAS Library Documentation

## Intro

The following documents the method to work with EAS attestations via Ethereum Account Abstraction.

## Methods

### generate12Words

Generates 12 words phrase (BIP39) for wallet creation.

```typescript
static generateMnemonic(): string[]
```

### derivePrivateKeyFrom12Words

Derives the private key from the 12-word mnemonic.

```typescript
static getPrivateKeyFromMnemonic(mnemonic: string[]): string
```

### derivePublicKeyAndAddress

Derives the Ethereum address from the provided private key.

```typescript
static getAddressFromPrivateKey(privateKey: string): string
```

### registerSchema

Load the EAS schema to an address.

```typescript
async registerSchema(): Promise<void>
```

### createAbstractAccount

Creates an abstract account for the wallet using the provided address. Throws an error on fail.

```typescript
static async createAbstractAccount(address: string): Promise<void>
```

### prepareEASTx

Prepares an EAS transaction by signing it with the provided private key.

```typescript
static prepareEASTx(data: any, privateKey: string): string
```

### prepareEASBatchTx

Prepares a batch of EAS transactions by signing each transaction in the batch.

```typescript
static prepareEASBatchTx(dataArray: any[], privateKey: string): string
```

### sendEASTx

Sends the transaction to the network.

```typescript
static async sendEASTx(signedTx: string): Promise<string>
```

### getEASExplorerLink

Returns the EAS explorer link for the given UID.

```typescript
static getEASExplorerLink(uid: string): string
```

## Example Usage

```typescript
async function main() {
  // Generate 12 words
  const mnemonic: string[] = WalletLibrary.generate12Words()

  // Derive private key from mnemonic
  const privateKey: string = WalletLibrary.derivePrivateKeyFrom12Words(mnemonic)

  // Derive public key and address from private key
  const keyInfo = WalletLibrary.derivePublicKeyAndAddress(privateKey)
  const address: string = keyInfo.address

  // Create abstract account for wallet
  await WalletLibrary.createAbstractAccount(address)

  // Prepare EAS transaction
  const easTransaction: string = WalletLibrary.prepareEASTx({ data: 'sample' }, privateKey)

  // Prepare batch of EAS transactions
  const easBatchTransaction: string = WalletLibrary.prepareEASBatchTx(
    [{ data: 'sample1' }, { data: 'sample2' }],
    privateKey
  )

  // Get EAS explorer link from UID
  const explorerLink: string = WalletLibrary.getEASExplorerLink('uid123')
}
```

## Scripts

### Register Schema

You can use the following bash script to register a schema.

Create a schema file and name it `schema` with the following content:

```
uint256 eventId, string[] weights, string comment
```

The run the following commmand to register it:

```bash
./register-schema.sh -p ./schema
```
