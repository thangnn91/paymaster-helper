import { BigNumber, ethers } from "ethers";
import { EIP712Signer, Provider, Wallet, types, utils } from "zksync-web3";
import { RPC } from "./config";

import {
  buildErc20PaymentParams,
  buildGeneralPaymentParams,
  buildNftPaymentParams,
} from "./builders";
import { AAWalletExecuteProps, WalletExecuteProps } from "./types";
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

export const paymasterSponsorExecute = async (
  props: WalletExecuteProps
): Promise<types.TransactionResponse> => {
  const provider = new Provider(RPC[props.network]);
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;

  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    provider,
    signer.address
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

export const paymasterExecuteAA = async (
  props: AAWalletExecuteProps
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
    props.aaAddress,
    props.paymentToken
  );

  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  const signedTxHash = EIP712Signer.getSignedDigest(transactionRequest);
  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
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
  props: AAWalletExecuteProps
): Promise<types.TransactionResponse> => {
  const provider = new Provider(RPC[props.network]);
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;

  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    provider,
    props.aaAddress
  );

  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  const signedTxHash = EIP712Signer.getSignedDigest(transactionRequest);
  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
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
  props: AAWalletExecuteProps
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
  const signedTxHash = EIP712Signer.getSignedDigest(transactionRequest);
  const signature = ethers.utils.arrayify(
    ethers.utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
  );

  transactionRequest.customData = {
    ...transactionRequest.customData,
    customSignature: signature,
  };

  return await signer.provider.sendTransaction(
    utils.serialize(transactionRequest)
  );
};
