import { BigNumber } from "ethers";
import { Provider, Wallet, types } from "zksync-web3";
import { RPC } from "./config";

import { buildErc20PaymentParams, buildNftPaymentParams } from "./builders";
import { WalletExecuteProps } from "./types";
export const paymasterExecute = async (
  props: WalletExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  const provider = new Provider(
    props.network === "testnet" ? RPC.testnet : RPC.mainnet
  );
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    provider,
    signer.address,
    props.paymentToken
  );

  return await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit.mul(120).div(100),
  });
};

export const paymasterNftExecute = async (
  props: WalletExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.nftType) {
    throw new Error("Nft type is required");
  }
  const provider = new Provider(
    props.network === "testnet" ? RPC.testnet : RPC.mainnet
  );
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;
  const { populatedTx, gasLimit, gasPrice } = await buildNftPaymentParams(
    props,
    provider,
    signer.address,
    props.nftType
  );
  return await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit.mul(120).div(100),
  });
};
