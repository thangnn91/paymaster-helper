import { BigNumber, ethers } from "ethers";
import { Wallet } from "zksync-web3";
import { Signer } from "zksync-web3";

// type Enumerate<
//   N extends number,
//   Acc extends number[] = []
// > = Acc["length"] extends N
//   ? Acc[number]
//   : Enumerate<N, [...Acc, Acc["length"]]>;

// type IntRange<F extends number, T extends number> = Exclude<
//   Enumerate<T>,
//   Enumerate<F>
// >;

// export type GasLimitRange = IntRange<0, 100>;

export type NftType = 0 | 1 | 2 | 3;
export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string;
  populateTransaction: ethers.PopulatedTransaction;
  innerInput?: string;
  minimumGasLimit?: number;
  defaultGasLimit?: number;
  bufferPercentage?: number;
}

export interface WalletExecuteProps extends BaseProps {
  signer: string | Wallet;
  paymentToken?: string;
  nftType?: NftType;
}

export interface SignerExecuteProps extends BaseProps {
  signer?: Signer;
  paymentToken?: string;
  nftType?: NftType;
}

export interface AAWalletExecuteProps extends WalletExecuteProps {
  aaAddress: string;
}

export interface AASignerExecuteProps extends SignerExecuteProps {
  aaAddress: string;
}

export type BuilderOutput = {
  populatedTx: ethers.PopulatedTransaction;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
};

export type UserNftOutput = [
  id: BigNumber,
  balance: BigNumber,
  uri: string,
  maxSponsor: BigNumber
] & {
  id: BigNumber;
  balance: BigNumber;
  uri: string;
  maxSponsor: BigNumber;
};
