## Paymaster Helper

A paymaster is a smart contract that can pay for transactions for its users, executing any logic to decide whether it should forward a transaction. For example, developers can allow users to run transactions for free or pay in your application's ERC-20 token instead. The library helps developers easily interact with paymaster contracts

## Installation

Using npm package manager

```
npm i @thangnn91/paymaster-helper

```

**Props**

```
interface PaymasterProps {
    network: 'testnet' | 'mainnet';//network provider
    pk: string; //the private key interacting to contract
    paymasterAddress?: string; //custom paymaster address
    paymentToken: string;//erc20 token to pay gas
    partnerCode: string; //Partner code used for reference
    populateTransaction: ethers.PopulatedTransaction;//populated transaction
}
```

**Usage**

```
import { paymasterExecute } from "@thangnn91/paymaster-helper"

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

const populateContract = await contract.populateTransaction[method](...params, {
      from: ACCOUNT,
});

await paymasterExecute({
  network: "testnet",
  pk: PRIVATE_KEY,
  paymentToken: PAYMENT_TOKEN,
  partnerCode: BYTES_32,
  populateTransaction: populateContract
})
```
