## Paymaster Helper

A paymaster is a smart contract that can pay for transactions for its users, executing any logic to decide whether it should forward a transaction. For example, developers can allow users to run transactions for free or pay in your application's ERC-20 token instead. The library helps developers easily interact with paymaster contracts

## 🛠 Prerequisites

- `node: >= 16.0.0` ([installation guide](https://nodejs.org/en/download/package-manager))
- `ethers: ~5.7.0`
- `zksync-web3: ~0.14.4`

## 📥 Installation & Setup

Using npm package manager

```
npm i @holdstation/paymaster-helper
```

Using yarn

```
yarn add @holdstation/paymaster-helper
```

## 📝 Examples

**Types**

```
export type BufferRange = IntRange<0, 50>;
export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string; //custom paymaster address
  populateTransaction: ethers.PopulatedTransaction;
  innerInput?: string; //custom inner input for paymaster
  gasBufferPercentage?: BufferRange; //gas buffer percentage, default: 30% in mainnet
}

export interface WalletExecuteProps extends BaseProps {
  signer: string | Wallet;
  paymentToken?: string;
  nftType?: 0 | 1 | 2 | 3;
}

export interface SignerExecuteProps extends BaseProps {
  signer?: Signer;
  paymentToken?: string;
  nftType?: 0 | 1 | 2 | 3;
}

export type BuilderOutput = {
  populatedTx: ethers.PopulatedTransaction;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
};

export type UserNftOutput = [
  nftType: BigNumber,
  balance: BigNumber,
  uri: string,
  maxSponsor: BigNumber
] & {
  nftType: BigNumber;
  balance: BigNumber;
  uri: string;
  maxSponsor: BigNumber;
};

```

### Using by wallet/private key

```
import { WalletPaymaster, SignerPaymaster } from "@holdstation/paymaster-helper"

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
const populateContract = await contract.populateTransaction[method](...params, {
      from: ACCOUNT,
});

//execute by wallet
await WalletPaymaster.paymasterExecute({
  network: "testnet",
  signer: signer,
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract
})

//execute using private key
await WalletPaymaster.paymasterExecute({
  network: "testnet",
  signer: PRIVATE_KEY,
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract
})
```

### Using by Web3Provider Signer (client extension)

```
function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
}

const walletConnectSigner = walletClientToSigner(walletClient);

await SignerPaymaster.paymasterExecute({
  //If no signer is specified, we will obtain it from the extension.
  signer: walletConnectSigner,
  network: "testnet",
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract
})

```

Our paymaster has special inner input information that enables us to distinguish our role
In case you use a custom paymaster address, you can adjust the inner input accordingly to align with your contract.

For example:

```
const abiCoder = new ethers.utils.AbiCoder();
const customInnerInput = abiCoder.encode(["bytes32"], [customInnerInputString]);
await SignerPaymaster.paymasterExecute({
  //If no signer is specified, we will obtain it from the extension.
  signer: walletConnectSigner,
  network: "testnet",
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract,
  paymasterAddress: YOUR_CUSTOM_PAYMASTER_ADDRESS,
  innerInput: customInnerInput
})
```
