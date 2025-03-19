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

Publish an EAS schema to an address.

```typescript
async registerSchema(): Promise<void>
```

For more details, refer to the [register-schema.js example](examples/register-schema.js).

### attest

Publish data to the EAS attestation contract.

```typescript
attest(data: object): Promise<string>
```

For more details, refer to the [attest.js example](examples/attest.js).

### getBalance

Get the balance of an Ethereum address.

```typescript
getBalance(address: string): Promise<string>
```

For more details, refer to the [check-balance.js example](examples/check-balance.js).

### fundAddress

Fund an Ethereum address with some ethers.

```typescript
fundAddress(recipientAddress: string, amount: string): Promise<string>
```

For more details, refer to the [fund-address.js example](examples/fund-address.js).

## Scripts

### Register Schema

You can use the following bash script to register a schema.

Create a schema file and name it `schema` with the following example content:

```
uint256 eventId, string[] weights, string comment
```

The run the following commmand to register it:

```bash
./register-schema.js -p ./schema
```
