import { BigNumber, ethers } from "ethers";
import { Contract, Provider, types, utils, Wallet } from "zksync-web3";
import {
  NFT_ABI,
  PAYMASTER_ADDRESS,
  PAYMASTER_CONTRACT_ABI,
  RPC,
} from "./config";
interface BaseProps {
  network: "testnet" | "mainnet";
  signer: string | Wallet;
  paymasterAddress?: string;
  populateTransaction: ethers.PopulatedTransaction;
}
export interface PaymasterProps extends BaseProps {
  partnerCode: string;
  paymentToken: string;
}

export interface PaymasterNftProps extends BaseProps {
  nftType: 0 | 1 | 2 | 3;
}

export const paymasterExecute = async (
  props: PaymasterProps
): Promise<types.TransactionResponse> => {
  const provider = new Provider(
    props.network === "testnet" ? RPC.testnet : RPC.mainnet
  );
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;
  const paymasterAddress =
    props.paymasterAddress ||
    PAYMASTER_ADDRESS[props.network as keyof typeof PAYMASTER_ADDRESS];
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    ...props.populateTransaction,
    from: signer.address,
  });

  const ethFee = gasLimit.mul(gasPrice).mul(110).div(100);

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );
  const [, minAmount] = await paymasterContract.getTokenFee(
    props.paymentToken,
    ethFee
  );
  const abiCoder = new ethers.utils.AbiCoder();
  const input = abiCoder.encode(["bytes32"], [props.partnerCode]);

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: props.paymentToken,
    minimalAllowance: minAmount,
    innerInput: input,
  });

  let populatedTx = props.populateTransaction;
  populatedTx.customData = {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };

  const sentTx = await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit,
  });
  return sentTx;
};

export const paymasterNftExecute = async (
  props: PaymasterNftProps
): Promise<types.TransactionResponse> => {
  const provider = new Provider(
    props.network === "testnet" ? RPC.testnet : RPC.mainnet
  );
  const signer =
    typeof props.signer === "string"
      ? new Wallet(props.signer, provider)
      : props.signer;
  const paymasterAddress =
    props.paymasterAddress ||
    PAYMASTER_ADDRESS[props.network as keyof typeof PAYMASTER_ADDRESS];
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    ...props.populateTransaction,
    from: signer.address,
  });

  const ethFee = gasLimit.mul(gasPrice).mul(110).div(100);

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );

  const nftContractAddress = await paymasterContract.nftAsset();
  const nftContract = new Contract(nftContractAddress, NFT_ABI, provider);
  const maxFeeSponsored = await nftContract.maxSponsorGas(props.nftType);
  if (BigNumber.from(maxFeeSponsored).lt(ethFee)) {
    throw new Error("Exceed maximum gas fee is sponsored");
  }
  const abiCoder = new ethers.utils.AbiCoder();
  const input = abiCoder.encode(["uint8"], [props.nftType]);

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "General",
    innerInput: input,
  });

  let populatedTx = props.populateTransaction;
  populatedTx.customData = {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };

  const sentTx = await signer.sendTransaction({
    ...populatedTx,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: BigNumber.from(0),
    gasLimit,
  });
  return sentTx;
};
