import { constants, utils } from "ethers";
import { Provider, Signer, Wallet, Web3Provider, types } from "zksync-ethers";

import { RPC } from "./config";
import {
  executeTransactionBySigner,
  executeTransactionBySmartAccount,
  executeTransactionByWallet,
  sponsorTransactionBySigner,
  sponsorTransactionBySmartAccount,
  sponsorTransactionByWallet,
} from "./transaction";
import { AAExecuteProps, ExecuteProps, UserTypes } from "./types";
import { checkExtensionInstalled, checkUserType } from "./utils";
export const paymasterExecute = async (
  props: ExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  const abiCoder = new utils.AbiCoder();
  const internalInnerInput =
    props.innerInput || abiCoder.encode(["address"], [constants.AddressZero]);

  const userType = checkUserType(props.signer);
  if (userType === UserTypes.PrivateKey) {
    const provider = new Provider(RPC[props.network]);
    const wallet = new Wallet(props.signer as string, provider);
    return await executeTransactionByWallet(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      provider,
      wallet
    );
  }
  if (userType === UserTypes.Wallet) {
    const provider = new Provider(RPC[props.network]);
    return await executeTransactionByWallet(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      provider,
      props.signer as Wallet
    );
  }
  if (userType === UserTypes.Signer) {
    return await executeTransactionBySigner(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      props.signer as Signer
    );
  }

  if (userType === UserTypes.Browser && checkExtensionInstalled()) {
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await executeTransactionBySigner(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      signer
    );
  }
  throw new Error("Invalid user type");
};

export const paymasterSponsorExecute = async (
  props: ExecuteProps
): Promise<types.TransactionResponse> => {
  const abiCoder = new utils.AbiCoder();
  const internalInnerInput =
    props.innerInput || abiCoder.encode(["address"], [constants.AddressZero]);

  const userType = checkUserType(props.signer);

  if (userType === UserTypes.PrivateKey) {
    const provider = new Provider(RPC[props.network]);
    const wallet = new Wallet(props.signer as string, provider);
    return await sponsorTransactionByWallet(
      { innerInput: internalInnerInput, ...props },
      provider,
      wallet
    );
  }
  if (userType === UserTypes.Wallet) {
    const provider = new Provider(RPC[props.network]);
    return await sponsorTransactionByWallet(
      { innerInput: internalInnerInput, ...props },
      provider,
      props.signer as Wallet
    );
  }
  if (userType === UserTypes.Signer) {
    return await sponsorTransactionBySigner(
      { innerInput: internalInnerInput, ...props },
      props.signer as Signer
    );
  }

  if (userType === UserTypes.Browser && checkExtensionInstalled()) {
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await sponsorTransactionBySigner(
      { innerInput: internalInnerInput, ...props },
      signer
    );
  }
  throw new Error("Invalid user type");
};

export const paymasterExecuteAA = async (
  props: AAExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  if (!props.aaAddress) {
    throw new Error("AA address is required");
  }
  const abiCoder = new utils.AbiCoder();
  const internalInnerInput =
    props.innerInput || abiCoder.encode(["address"], [constants.AddressZero]);

  const userType = checkUserType(props.signer);
  if (userType === UserTypes.PrivateKey) {
    const provider = new Provider(RPC[props.network]);
    const wallet = new Wallet(props.signer as string, provider);
    return await executeTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      provider,
      wallet,
      UserTypes.Wallet,
      props.aaAddress
    );
  }
  if (userType === UserTypes.Wallet) {
    const provider = new Provider(RPC[props.network]);
    return await executeTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      provider,
      props.signer as Wallet,
      UserTypes.Wallet,
      props.aaAddress
    );
  }
  if (userType === UserTypes.Signer) {
    const signer = props.signer as Signer;
    return await executeTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      signer.provider,
      signer,
      UserTypes.Signer,
      props.aaAddress
    );
  }

  if (userType === UserTypes.Browser && checkExtensionInstalled()) {
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await executeTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      props.paymentToken,
      signer.provider,
      signer,
      UserTypes.Signer,
      props.aaAddress
    );
  }
  throw new Error("Invalid user type");
};

export const paymasterSponsorAA = async (
  props: AAExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.aaAddress) {
    throw new Error("AA address is required");
  }
  const abiCoder = new utils.AbiCoder();
  const internalInnerInput =
    props.innerInput || abiCoder.encode(["address"], [constants.AddressZero]);

  const userType = checkUserType(props.signer);
  if (userType === UserTypes.PrivateKey) {
    const provider = new Provider(RPC[props.network]);
    const wallet = new Wallet(props.signer as string, provider);
    return await sponsorTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      provider,
      wallet,
      UserTypes.Wallet,
      props.aaAddress
    );
  }
  if (userType === UserTypes.Wallet) {
    const provider = new Provider(RPC[props.network]);
    return await sponsorTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      provider,
      props.signer as Wallet,
      UserTypes.Wallet,
      props.aaAddress
    );
  }
  if (userType === UserTypes.Signer) {
    const signer = props.signer as Signer;
    return await sponsorTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      signer.provider,
      signer,
      UserTypes.Signer,
      props.aaAddress
    );
  }

  if (userType === UserTypes.Browser && checkExtensionInstalled()) {
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await sponsorTransactionBySmartAccount(
      { innerInput: internalInnerInput, ...props },
      signer.provider,
      signer,
      UserTypes.Signer,
      props.aaAddress
    );
  }
  throw new Error("Invalid user type");
};
