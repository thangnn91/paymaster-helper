## Paymaster Helper

A paymaster is a smart contract that can pay for transactions for its users, executing any logic to decide whether it should forward a transaction. For example, developers can allow users to run transactions for free or pay in your application's ERC-20 token instead. The library helps developers easily interact with paymaster contracts

## 🛠 Prerequisites

- `node: >= 16.0.0` ([installation guide](https://nodejs.org/en/download/package-manager))
- `ethers: ~5.7.0`
- `zksync-ether: ~5.7.0`

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
export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string; //custom paymaster address
  populateTransaction: ethers.PopulatedTransaction;
  innerInput?: string; //custom inner input for paymaster
  minimumGasLimit?: number;
  defaultGasLimit?: number; //default gas limit in case gas estimate for paymaster fails, if no param is passed, default is 1_500_000
  bufferPercentage?: number;
}

export interface ExecuteProps extends BaseProps {
  signer?: string | Wallet | Signer; //private key / wallet / signer
  paymentToken?: EthereumAddress; //start with '0x'
}

export interface AAExecuteProps extends ExecuteProps {
  aaAddress: EthereumAddress; //start with '0x'
}

export type BuilderOutput = {
  populatedTx: ethers.PopulatedTransaction;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
};

```

### Using by wallet/private key

```
import { Partner } from "@holdstation/paymaster-helper"

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
const populateContract = await contract.populateTransaction[method](...params, {
      from: ACCOUNT,
});


const projectName = "YOUR_PROJECT_NAME"; eg: SYNSWAP, XY_FINANCE, ORBITER ...
const partnerCode = ethers.utils.formatBytes32String(projectName);

//execute using private key
const privateKey = '0x...........'

await Partner.paymasterExecute({
  network: "testnet",
  signer: privateKey,
  paymentToken: PAYMENT_TOKEN, //could be usdc/usdt address ...
  populateTransaction: populateContract,
  innerInput: partnerCode,
})

//execute using wallet
const privateKey = '0x...........'
const provider = new Provider('chain_rpc');
const wallet = new Wallet(privateKey, provider);
await Partner.paymasterExecute({
  network: "testnet",
  signer: wallet,
  paymentToken: PAYMENT_TOKEN, //could be usdc/usdt address ...
  populateTransaction: populateContract,
  innerInput: partnerCode,
})

```

### Using by Web3Provider Signer

```
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer: Signer = new Web3Provider(window.ethereum).getSigner();
await Partner.paymasterExecute({
  //If no signer is specified, we will obtain it from the extension.
  signer: walletConnectSigner,
  network: "testnet",
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract,
  innerInput: partnerCode,
})

```

### Using by client extension (eg: Metamask)

```
//No signer is specified here, because we will obtain it from the extension.
//Please make sure you have installed the browser extension
await Partner.paymasterExecute({
  network: "testnet",
  paymentToken: PAYMENT_TOKEN,
  populateTransaction: populateContract,
  innerInput: partnerCode,
})
```
