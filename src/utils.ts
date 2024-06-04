import { UserTypes } from "./types";

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const checkUserType = (obj: any): UserTypes => {
  if (
    typeof obj?.getAddress === "function" &&
    typeof obj?.signTransaction === "function" &&
    typeof obj?.address === "string"
  ) {
    return UserTypes.Wallet;
  } else if (typeof obj?.getAddress === "function") {
    return UserTypes.Signer;
  } else if (typeof obj === "string") {
    return UserTypes.PrivateKey;
  }
  return UserTypes.Browser;
};

export const checkExtensionInstalled = (): boolean => {
  if (
    !(
      typeof window["ethereum"] !== "undefined" ||
      typeof window["web3"] !== "undefined"
    )
  ) {
    throw new Error("Extension not found");
  }
  return true;
};
