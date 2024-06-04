import { BigNumber, ethers } from "ethers";
import { Wallet, Signer } from "zksync-ethers";

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

export type EthereumAddress = `0x${string}`;

export enum UserTypes {
  Signer,
  Wallet,
  PrivateKey,
  Browser,
}

export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string;
  populateTransaction: ethers.PopulatedTransaction;
  innerInput?: string;
  minimumGasLimit?: number;
  defaultGasLimit?: number;
  bufferPercentage?: number;
}

export interface ExecuteProps extends BaseProps {
  signer?: string | Wallet | Signer | undefined;
  paymentToken?: EthereumAddress;
}

export interface AAExecuteProps extends ExecuteProps {
  aaAddress: EthereumAddress;
}

export type BuilderOutput = {
  populatedTx: ethers.PopulatedTransaction;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
};
