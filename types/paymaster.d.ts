import { ethers } from "ethers";
import { types } from "zksync-web3";
export interface PaymasterProps {
    network: "testnet" | "mainnet";
    pk: string;
    paymentToken: string;
    partnerCode: string;
    paymasterAddress?: string;
    populateTransaction: ethers.PopulatedTransaction;
}
export declare const paymasterExecute: (props: PaymasterProps) => Promise<types.TransactionResponse>;
