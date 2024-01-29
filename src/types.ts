import { BigNumber, ethers } from "ethers";
import { Wallet } from "zksync-web3";
import { Signer } from "zksync-web3";
export interface BaseProps {
  network: "testnet" | "mainnet";
  paymasterAddress?: string;
  populateTransaction: ethers.PopulatedTransaction;
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
