import { BigNumber, ethers } from "ethers";
import { Contract, Provider, utils } from "zksync-web3";
import {
  ERC20_ABI,
  NFT_ABI,
  PAYMASTER_ADDRESS,
  PAYMASTER_CONTRACT_ABI,
  PAYMASTER_NFT_ADDRESS,
  PAYMASTER_NFT_CONTRACT_ABI,
  RPC,
} from "./config";
import { BaseProps, BuilderOutput, UserNftOutput } from "./types";
import { assert } from "./utils";
export async function buildErc20PaymentParams(
  props: BaseProps,
  provider: Provider,
  from: string,
  paymentToken: string
): Promise<BuilderOutput> {
  const paymasterAddress =
    props.paymasterAddress || PAYMASTER_ADDRESS[props.network];

  const gasPrice = await provider.getGasPrice();

  let innerInput: string | undefined = undefined;
  if (props.innerInput) {
    innerInput = props.innerInput;
  } else if (!props.paymasterAddress) {
    const abiCoder = new ethers.utils.AbiCoder();
    innerInput = abiCoder.encode(["address"], [ethers.constants.AddressZero]);
  }
  let populatedTx = props.populateTransaction;
  let gasLimit = await provider.estimateGas({
    ...populatedTx,
    from,
  });

  gasLimit = gasLimit.mul(105).div(100);
  const ethFee = gasLimit.mul(gasPrice);
  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );
  const [, minAmount] = await paymasterContract.getTokenFee(
    paymentToken,
    ethFee
  );

  const erc20Contract = new Contract(paymentToken, ERC20_ABI, provider);
  const userBalance = await erc20Contract.balanceOf(from);

  assert(
    BigNumber.from(userBalance).gte(BigNumber.from(minAmount)),
    "insufficient erc20 balance "
  );

  const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: paymentToken,
    minimalAllowance: ethers.BigNumber.from(minAmount),
    innerInput: innerInput || new Uint8Array(),
  });

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
  nftType: 0 | 1 | 2 | 3,
  paymentToken?: string
): Promise<BuilderOutput> {
  const paymasterAddress =
    props.paymasterAddress || PAYMASTER_NFT_ADDRESS[props.network];
  const gasPrice = await provider.getGasPrice();

  let innerInput: string | undefined = undefined;
  if (props.innerInput) {
    innerInput = props.innerInput;
  } else if (!props.paymasterAddress) {
    const abiCoder = new ethers.utils.AbiCoder();
    innerInput = abiCoder.encode(["uint8"], [nftType]);
  }

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_NFT_CONTRACT_ABI,
    provider
  );

  let populatedTx = props.populateTransaction;

  let gasLimit = await provider.estimateGas({
    ...populatedTx,
    from,
  });

  gasLimit = gasLimit.mul(105).div(100);
  const ethFee = gasLimit.mul(gasPrice);
  const nftContractAddress = await paymasterContract.nftAsset();
  const nftContract = new Contract(nftContractAddress, NFT_ABI, provider);
  const maxFeeSponsored = await nftContract.maxSponsorGas(nftType);

  if (!paymentToken && BigNumber.from(maxFeeSponsored).lt(ethFee)) {
    throw new Error("Exceed maximum gas fee is sponsored");
  }

  if (!paymentToken) {
    const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
      type: "General",
      innerInput: innerInput || new Uint8Array(),
    });
    populatedTx.customData = {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    };
  } else {
    const [, minAmount] = await paymasterContract.getTokenFee(
      paymentToken,
      nftType,
      ethFee
    );
    const erc20Contract = new Contract(paymentToken, ERC20_ABI, provider);
    const userBalance = await erc20Contract.balanceOf(from);
    assert(
      BigNumber.from(userBalance).gte(BigNumber.from(minAmount)),
      "insufficient erc20 balance "
    );

    const paymasterParams = utils.getPaymasterParams(paymasterAddress, {
      type: "ApprovalBased",
      token: paymentToken,
      minimalAllowance: BigNumber.from(minAmount),
      innerInput: innerInput || new Uint8Array(),
    });
    populatedTx.customData = {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    };
  }

  return { populatedTx, gasLimit, gasPrice };
}

export async function getMaxSponsorGasByNft(
  network: "mainnet" | "testnet",
  nftType: 0 | 1 | 2 | 3
): Promise<BigNumber> {
  const provider = new Provider(RPC[network]);
  const paymasterAddress = PAYMASTER_NFT_ADDRESS[network];
  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_NFT_CONTRACT_ABI,
    provider
  );
  const nftContractAddress = await paymasterContract.nftAsset();
  const nftContract = new Contract(nftContractAddress, NFT_ABI, provider);
  const maxFeeSponsored = await nftContract.maxSponsorGas(nftType);
  return BigNumber.from(maxFeeSponsored);
}

export async function getErc20MustBePaid(
  props: BaseProps,
  from: string,
  nftType: 0 | 1 | 2 | 3,
  paymentToken: string
): Promise<BigNumber> {
  const provider = new Provider(RPC[props.network]);
  const paymasterAddress = PAYMASTER_NFT_ADDRESS[props.network];
  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_NFT_CONTRACT_ABI,
    provider
  );
  const gasPrice = await provider.getGasPrice();

  let innerInput: string | undefined = undefined;
  if (props.innerInput) {
    innerInput = props.innerInput;
  } else if (!props.paymasterAddress) {
    const abiCoder = new ethers.utils.AbiCoder();
    innerInput = abiCoder.encode(["uint8"], [nftType]);
  }

  let gasLimit = await provider.estimateGas({
    ...props.populateTransaction,
    from,
  });

  gasLimit = gasLimit.mul(105).div(100);
  const ethFee = gasLimit.mul(gasPrice);
  const [, minAmount] = await paymasterContract.getTokenFee(
    paymentToken,
    nftType,
    ethFee
  );
  return BigNumber.from(minAmount);
}

export async function getAllNfts(
  network: "mainnet" | "testnet",
  user: string
): Promise<UserNftOutput[]> {
  const provider = new Provider(RPC[network]);
  const paymasterAddress = PAYMASTER_NFT_ADDRESS[network];
  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_NFT_CONTRACT_ABI,
    provider
  );
  const nftContractAddress = await paymasterContract.nftAsset();
  const nftContract = new Contract(nftContractAddress, NFT_ABI, provider);
  const userNfts: UserNftOutput[] = await nftContract.getAllNfts(user);
  return userNfts;
}
