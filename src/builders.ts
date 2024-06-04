import { BigNumber, constants } from "ethers";
import { Contract, Provider, utils as zkUtils } from "zksync-ethers";
import {
  DEFAULT_GAS_LIMIT,
  ERC20_ABI,
  INTERNAL_PAYMASTER_ADDRESS,
  PAYMASTER_CONTRACT_ABI,
} from "./config";
import { BaseProps, BuilderOutput } from "./types";
import { assert } from "./utils";

export async function estimateGasErc20Payment(
  props: BaseProps,
  provider: Provider,
  from: string,
  paymentToken: string
): Promise<Omit<BuilderOutput, "populatedTx">> {
  const gasPrice = await provider.getGasPrice();
  if (props.defaultGasLimit && props.defaultGasLimit > 0) {
    return { gasLimit: BigNumber.from(props.defaultGasLimit), gasPrice };
  }
  const paymasterAddress =
    props.paymasterAddress || INTERNAL_PAYMASTER_ADDRESS[props.network];

  const populatedTx = props.populateTransaction;

  const prePaymasterParams = zkUtils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: paymentToken,
    minimalAllowance: BigNumber.from(constants.MaxUint256),
    innerInput: props.innerInput || new Uint8Array(),
  });
  populatedTx.customData = {
    gasPerPubdata: zkUtils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams: prePaymasterParams,
  };

  const defaultGasLimit = BigNumber.from(
    props.minimumGasLimit || DEFAULT_GAS_LIMIT
  );

  let gasLimit = defaultGasLimit;

  try {
    gasLimit = await provider.estimateGas({
      ...populatedTx,
      from,
    });
  } catch (error) {
    console.log("🚀 ~ error estimateGas with custom data:", error);
    //gaslimit without paymaster validation
    delete populatedTx.customData;
    const preGasLimit = await provider.estimateGas({
      ...populatedTx,
      from,
    });
    gasLimit = preGasLimit.mul(150).div(100).gt(defaultGasLimit)
      ? preGasLimit.mul(150).div(100)
      : defaultGasLimit;
  }
  return {
    gasLimit: props.bufferPercentage
      ? gasLimit.mul(100 + props.bufferPercentage).div(100)
      : gasLimit,
    gasPrice,
  };
}

export async function buildErc20PaymentParams(
  props: BaseProps,
  provider: Provider,
  from: string,
  paymentToken: string
): Promise<BuilderOutput> {
  const paymasterAddress =
    props.paymasterAddress || INTERNAL_PAYMASTER_ADDRESS[props.network];

  const populatedTx = props.populateTransaction;

  const { gasLimit, gasPrice } = await estimateGasErc20Payment(
    props,
    provider,
    from,
    paymentToken
  );

  const ethFee = gasLimit.mul(gasPrice);

  const paymasterContract = new Contract(
    paymasterAddress,
    PAYMASTER_CONTRACT_ABI,
    provider
  );

  const [afterDiscount, minAmount] = await paymasterContract.getTokenFee(
    paymentToken,
    ethFee
  );

  const erc20Contract = new Contract(paymentToken, ERC20_ABI, provider);
  const userBalance = await erc20Contract.balanceOf(from);

  assert(
    BigNumber.from(userBalance).gte(BigNumber.from(afterDiscount)),
    "insufficient erc20 balance"
  );

  const paymasterParams = zkUtils.getPaymasterParams(paymasterAddress, {
    type: "ApprovalBased",
    token: paymentToken,
    minimalAllowance: BigNumber.from(minAmount).mul(105).div(100),
    innerInput: props.innerInput || new Uint8Array(),
  });

  populatedTx.customData = {
    gasPerPubdata: zkUtils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };

  return { populatedTx, gasLimit, gasPrice };
}

export async function buildGeneralPaymentParams(
  props: BaseProps,
  provider: Provider,
  from: string
): Promise<BuilderOutput> {
  const gasPrice = await provider.getGasPrice();

  const paymasterAddress =
    props.paymasterAddress || INTERNAL_PAYMASTER_ADDRESS[props.network];

  const populatedTx = props.populateTransaction;

  const prePaymasterParams = zkUtils.getPaymasterParams(paymasterAddress, {
    type: "General",
    innerInput: props.innerInput || new Uint8Array(),
  });
  populatedTx.customData = {
    gasPerPubdata: zkUtils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams: prePaymasterParams,
  };

  const gasLimit =
    props.defaultGasLimit && props.defaultGasLimit > 0
      ? BigNumber.from(props.defaultGasLimit)
      : await provider.estimateGas({
          ...populatedTx,
          from,
        });

  const paymasterParams = zkUtils.getPaymasterParams(paymasterAddress, {
    type: "General",
    innerInput: props.innerInput || new Uint8Array(),
  });

  populatedTx.customData = {
    gasPerPubdata: zkUtils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
    paymasterParams,
  };
  return { populatedTx, gasLimit, gasPrice };
}
