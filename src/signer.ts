import { BigNumber } from "ethers";
import { Signer, Web3Provider, types } from "zksync-web3";

import { buildErc20PaymentParams, buildNftPaymentParams } from "./builders";
import { SignerExecuteProps } from "./types";
export const paymasterExecute = async (
  props: SignerExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  if (
    !(
      typeof window["ethereum"] !== "undefined" ||
      typeof window["web3"] !== "undefined"
    ) &&
    !props.signer
  ) {
    throw new Error("Extension not found");
  }
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    signer.provider,
    await signer.getAddress(),
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
  props: SignerExecuteProps
): Promise<types.TransactionResponse> => {
  if (
    !(
      typeof window["ethereum"] !== "undefined" ||
      typeof window["web3"] !== "undefined"
    ) &&
    !props.signer
  ) {
    throw new Error("Extension not found");
  }
  if (!props.nftType) {
    throw new Error("Nft type is required");
  }
  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildNftPaymentParams(
    props,
    signer.provider,
    await signer.getAddress(),
    props.nftType
  );
  return await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit.mul(120).div(100),
  });
};
