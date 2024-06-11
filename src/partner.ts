import { Provider, Signer, Wallet, Web3Provider, types } from "zksync-ethers";
import { PAYMASTER_ADDRESS, RPC } from "./config";
import {
  executeTransactionBySigner,
  executeTransactionBySmartAccount,
  executeTransactionByWallet,
} from "./transaction";
import { AAExecuteProps, ExecuteProps, UserTypes } from "./types";
import { checkExtensionInstalled, checkUserType } from "./utils";
export const paymasterExecute = async (
  props: ExecuteProps
): Promise<types.TransactionResponse> => {
  if (!props.paymentToken) {
    throw new Error("Payment token is required");
  }
  if (!props.innerInput) {
    throw new Error("Partner code is required");
  }
  const provider = new Provider(RPC[props.network]);
  const userType = checkUserType(props.signer);
  if (userType === UserTypes.PrivateKey) {
    const wallet = new Wallet(props.signer as string, provider);
    return await executeTransactionByWallet(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
      provider,
      wallet
    );
  }
  if (userType === UserTypes.Wallet) {
    return await executeTransactionByWallet(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
      provider,
      props.signer as Wallet
    );
  }
  if (userType === UserTypes.Signer) {
    return await executeTransactionBySigner(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
      props.signer as Signer
    );
  }

  if (userType === UserTypes.Browser) {
    if (
      !(
        typeof window["ethereum"] !== "undefined" ||
        typeof window["web3"] !== "undefined"
      )
    ) {
      throw new Error("Extension not found");
    }
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await executeTransactionBySigner(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
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
  if (!props.innerInput) {
    throw new Error("Partner code is required");
  }
  if (!props.aaAddress) {
    throw new Error("AA address is required");
  }
  const userType = checkUserType(props.signer);
  if (userType === UserTypes.PrivateKey) {
    const provider = new Provider(RPC[props.network]);
    const wallet = new Wallet(props.signer as string, provider);
    return await executeTransactionBySmartAccount(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
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
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
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
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
      signer.provider,
      signer,
      UserTypes.Wallet,
      props.aaAddress
    );
  }

  if (userType === UserTypes.Browser && checkExtensionInstalled()) {
    const signer = new Web3Provider(window["ethereum"]).getSigner();
    return await executeTransactionBySmartAccount(
      {
        paymasterAddress:
          props.paymasterAddress || PAYMASTER_ADDRESS[props.network],
        ...props,
      },
      props.paymentToken,
      signer.provider,
      signer,
      UserTypes.Wallet,
      props.aaAddress
    );
  }
  throw new Error("Invalid user type");
};
