import { BigNumber, ethers } from "ethers";
import { Contract, Provider, utils } from "zksync-web3";
import { NFT_ABI, PAYMASTER_ADDRESS, PAYMASTER_CONTRACT_ABI } from "./config";
import { BaseProps, BuilderOutput } from "./types";

export async function buildErc20PaymentParams(
  props: BaseProps,
  provider: Provider,
  from: string,
  paymentToken: string
): Promise<BuilderOutput> {
  const paymasterAddress =
    props.paymasterAddress ||
    PAYMASTER_ADDRESS[props.network as keyof typeof PAYMASTER_ADDRESS];
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    ...props.populateTransaction,
    from,
  });

  const ethFee = gasLimit.mul(gasPrice).mul(130).div(100);

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );
  const [, minAmount] = await paymasterContract.getTokenFee(
    paymentToken,
    ethFee
  );
  const abiCoder = new ethers.utils.AbiCoder();
  const input = abiCoder.encode(["address"], [ethers.constants.AddressZero]);

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: paymentToken,
    minimalAllowance: minAmount,
    innerInput: input,
  });

  let populatedTx = props.populateTransaction;
  populatedTx.customData = {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };
  return { populatedTx, gasLimit, gasPrice };
}

export async function buildNftPaymentParams(
  props: BaseProps,
  provider: Provider,
  from: string,
  nftType: 0 | 1 | 2 | 3
): Promise<BuilderOutput> {
  const paymasterAddress =
    props.paymasterAddress ||
    PAYMASTER_ADDRESS[props.network as keyof typeof PAYMASTER_ADDRESS];
  const gasPrice = await provider.getGasPrice();
  const gasLimit = await provider.estimateGas({
    ...props.populateTransaction,
    from,
  });

  const ethFee = gasLimit.mul(gasPrice).mul(130).div(100);

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );

  const nftContractAddress = await paymasterContract.nftAsset();
  const nftContract = new Contract(nftContractAddress, NFT_ABI, provider);
  const maxFeeSponsored = await nftContract.maxSponsorGas(nftType);
  if (BigNumber.from(maxFeeSponsored).lt(ethFee)) {
    throw new Error("Exceed maximum gas fee is sponsored");
  }
  const abiCoder = new ethers.utils.AbiCoder();
  const input = abiCoder.encode(["uint8"], [nftType]);

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "General",
    innerInput: input,
  });

  let populatedTx = props.populateTransaction;
  populatedTx.customData = {
    gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };
  return { populatedTx, gasLimit, gasPrice };
}
