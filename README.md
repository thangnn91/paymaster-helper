## Paymaster Helper

A paymaster is a smart contract that can pay for transactions for its users, executing any logic to decide whether it should forward a transaction. For example, developers can allow users to run transactions for free or pay in your application's ERC-20 token instead. The library helps developers easily interact with paymaster contracts

## Installation

Using npm package manager

```
npm i @holdstation/paymaster-helper

```

**Props**

```

interface BaseProps {
  network: "testnet" | "mainnet"; //network provider
  signer: string | Wallet; //the private key or signed wallet interacting to contract
  paymasterAddress?: string; //custom paymaster address
  populateTransaction: ethers.PopulatedTransaction; //populated transaction
}
export interface PaymasterProps extends BaseProps {
  partnerCode: string; //Partner code used for reference
  paymentToken: string; //erc20 token to pay gas
}

```

**Usage**

```
import { paymaster } from "@holdstation/paymaster-helper"

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
const signer = provider.getSigner(account.address);
const populateContract = await contract.populateTransaction[method](...params, {
      from: ACCOUNT,
});
const partnerCode = ethers.utils.formatBytes32String('');
//execute by signer
await paymaster.paymasterExecute({
  network: "testnet",
  signer: signer,
  paymentToken: PAYMENT_TOKEN,
  partnerCode: partnerCode,
  populateTransaction: populateContract
})

//execute using private key
await paymaster.paymasterExecute({
  network: "testnet",
  signer: PRIVATE_KEY,
  paymentToken: PAYMENT_TOKEN,
  partnerCode: partnerCode,
  populateTransaction: populateContract
})
```
