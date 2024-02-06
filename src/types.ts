import { BigNumber, ethers } from "ethers";
import { Wallet } from "zksync-web3";
import { Signer } from "zksync-web3";

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export type BufferRange = IntRange<0, 50>;
export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string;
  populateTransaction: ethers.PopulatedTransaction;
  innerInput?: string;
  gasBufferPercentage?: BufferRange;
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
