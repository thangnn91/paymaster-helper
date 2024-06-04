import {
  Provider,
  Wallet,
  Signer,
  EIP712Signer,
  utils as zkUtils,
} from "zksync-ethers";
import { buildErc20PaymentParams, buildGeneralPaymentParams } from "./builders";
import { BaseProps, EthereumAddress, UserTypes } from "./types";
import { BigNumber, utils } from "ethers";

export const executeTransactionByWallet = async (
  props: BaseProps,
  paymentToken: EthereumAddress,
  provider: Provider,
  wallet: Wallet
) => {
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    provider,
    wallet.address,
    paymentToken
  );
  return await wallet.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  });
};

export const executeTransactionBySigner = async (
  props: BaseProps,
  paymentToken: EthereumAddress,
  signer: Signer
) => {
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    signer.provider,
    await signer.getAddress(),
    paymentToken
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };
  return await signer.sendTransaction(transactionRequest);
};

export const sponsorTransactionByWallet = async (
  props: BaseProps,
  provider: Provider,
  wallet: Wallet
) => {
  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    provider,
    wallet.address
  );
  return await wallet.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  });
};

export const sponsorTransactionBySigner = async (
  props: BaseProps,
  signer: Signer
) => {
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

export const executeTransactionBySmartAccount = async (
  props: BaseProps,
  paymentToken: EthereumAddress,
  provider: Provider,
  signer: any,
  userType: UserTypes.Wallet | UserTypes.Signer,
  smartAccountAddress: EthereumAddress
) => {
  const { populatedTx, gasLimit, gasPrice } = await buildErc20PaymentParams(
    props,
    provider,
    smartAccountAddress,
    paymentToken
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };

  if (userType === UserTypes.Wallet) {
    const signedTxHash = EIP712Signer.getSignedDigest(transactionRequest);
    const signature = utils.arrayify(
      utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
    );
    transactionRequest.customData = {
      ...transactionRequest.customData,
      customSignature: signature,
    };
  } else {
    const signature = utils.arrayify(
      utils.joinSignature(await signer.eip712.sign(transactionRequest))
    );
    transactionRequest.customData = {
      ...transactionRequest.customData,
      customSignature: signature,
    };
  }

  return await signer.provider.sendTransaction(
    zkUtils.serialize(transactionRequest)
  );
};

export const sponsorTransactionBySmartAccount = async (
  props: BaseProps,
  provider: Provider,
  signer: any,
  userType: UserTypes.Wallet | UserTypes.Signer,
  smartAccountAddress: EthereumAddress
) => {
  const { populatedTx, gasLimit, gasPrice } = await buildGeneralPaymentParams(
    props,
    provider,
    smartAccountAddress
  );
  const transactionRequest = {
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit: gasLimit,
  };

  if (userType === UserTypes.Wallet) {
    const signedTxHash = EIP712Signer.getSignedDigest(transactionRequest);
    const signature = utils.arrayify(
      utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
    );
    transactionRequest.customData = {
      ...transactionRequest.customData,
      customSignature: signature,
    };
  } else {
    const signature = utils.arrayify(
      utils.joinSignature(await signer.eip712.sign(transactionRequest))
    );
    transactionRequest.customData = {
      ...transactionRequest.customData,
      customSignature: signature,
    };
  }

  return await signer.provider.sendTransaction(
    zkUtils.serialize(transactionRequest)
  );
};
