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
  const provider = new Provider(RPC[props.network]);
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
    gasLimit: gasLimit,
  });
};

export const paymasterNftExecute = async (
  props: WalletExecuteProps
): Promise<types.TransactionResponse> => {
  if (props.nftType === undefined || props.nftType === null) {
    throw new Error("Nft type is required");
  }
  const provider = new Provider(RPC[props.network]);
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;
  const { populatedTx, gasLimit, gasPrice } = await buildNftPaymentParams(
    props,
    provider,
    signer.address,
    props.nftType,
    props.paymentToken
  );
  return await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  });
};
