import { BigNumber, ethers } from "ethers";
import { Signer, Web3Provider, types, utils } from "zksync-web3";

import {
  buildErc20PaymentParams,
  buildGeneralPaymentParams,
  buildNftPaymentParams,
} from "./builders";
import { AASignerExecuteProps, SignerExecuteProps } from "./types";
export const paymasterExecute = async (
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
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  return await signer.sendTransaction(transactionRequest);
};

export const paymasterSponsorExecute = async (
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

  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    signer.provider,
    await signer.getAddress()
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  return await signer.sendTransaction(transactionRequest);
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
  if (props.nftType === undefined || props.nftType === null) {
    throw new Error("Nft type is required");
  }
  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildNftPaymentParams(
    props,
    signer.provider,
    await signer.getAddress(),
    props.nftType,
    props.paymentToken
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  return await signer.sendTransaction(transactionRequest);
};

export const paymasterExecuteAA = async (
  props: AASignerExecuteProps
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
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    signer.provider,
    props.aaAddress,
    props.paymentToken
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(await signer.eip712.sign(transactionRequest))
  );
  transactionRequest.customData = {
    ...transactionRequest.customData,
    customSignature: signature,
  };
  return await signer.provider.sendTransaction(
    utils.serialize(transactionRequest)
  );
};

export const paymasterSponsorAA = async (
  props: AASignerExecuteProps
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

  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();

  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    signer.provider,
    props.aaAddress
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };

  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(await signer.eip712.sign(transactionRequest))
  );

  transactionRequest.customData = {
    ...transactionRequest.customData,
    customSignature: signature,
  };

  return await signer.provider.sendTransaction(
    utils.serialize(transactionRequest)
  );
};

export const paymasterNftExecuteAA = async (
  props: AASignerExecuteProps
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
  if (props.nftType === undefined || props.nftType === null) {
    throw new Error("Nft type is required");
  }
  const signer: Signer =
    props.signer || new Web3Provider(window["ethereum"]).getSigner();
  const { populatedTx, gasLimit, gasPrice } = await buildNftPaymentParams(
    props,
    signer.provider,
    props.aaAddress,
    props.nftType,
    props.paymentToken
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(await signer.eip712.sign(transactionRequest))
  );
  transactionRequest.customData = {
    ...transactionRequest.customData,
    customSignature: signature,
  };
  return await signer.provider.sendTransaction(
    utils.serialize(transactionRequest)
  );
};
