/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface MockStableMathInterface extends ethers.utils.Interface {
  functions: {
    "bptInForExactTokensOut(uint256,uint256[],uint256[],uint256,uint256)": FunctionFragment;
    "calculateDueTokenProtocolSwapFeeAmount(uint256,uint256[],uint256,uint256,uint256)": FunctionFragment;
    "exactBPTInForTokenOut(uint256,uint256[],uint256,uint256,uint256,uint256)": FunctionFragment;
    "exactBPTInForTokensOut(uint256[],uint256,uint256)": FunctionFragment;
    "exactTokensInForBPTOut(uint256,uint256[],uint256[],uint256,uint256)": FunctionFragment;
    "inGivenOut(uint256,uint256[],uint256,uint256,uint256)": FunctionFragment;
    "invariant(uint256,uint256[])": FunctionFragment;
    "outGivenIn(uint256,uint256[],uint256,uint256,uint256)": FunctionFragment;
    "tokenInForExactBPTOut(uint256,uint256[],uint256,uint256,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "bptInForExactTokensOut",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish[],
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateDueTokenProtocolSwapFeeAmount",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "exactBPTInForTokenOut",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "exactBPTInForTokensOut",
    values: [BigNumberish[], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "exactTokensInForBPTOut",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish[],
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "inGivenOut",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "invariant",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "outGivenIn",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenInForExactBPTOut",
    values: [
      BigNumberish,
      BigNumberish[],
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "bptInForExactTokensOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateDueTokenProtocolSwapFeeAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exactBPTInForTokenOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exactBPTInForTokensOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exactTokensInForBPTOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "inGivenOut", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "invariant", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "outGivenIn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenInForExactBPTOut",
    data: BytesLike
  ): Result;

  events: {};
}

export class MockStableMath extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MockStableMathInterface;

  functions: {
    bptInForExactTokensOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsOut: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculateDueTokenProtocolSwapFeeAmount(
      amp: BigNumberish,
      balances: BigNumberish[],
      lastInvariant: BigNumberish,
      tokenIndex: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    exactBPTInForTokenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    exactBPTInForTokensOut(
      balances: BigNumberish[],
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    exactTokensInForBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsIn: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    inGivenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    invariant(
      amp: BigNumberish,
      balances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    outGivenIn(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenInForExactBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountOut: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  bptInForExactTokensOut(
    amp: BigNumberish,
    balances: BigNumberish[],
    amountsOut: BigNumberish[],
    bptTotalSupply: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculateDueTokenProtocolSwapFeeAmount(
    amp: BigNumberish,
    balances: BigNumberish[],
    lastInvariant: BigNumberish,
    tokenIndex: BigNumberish,
    protocolSwapFeePercentage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  exactBPTInForTokenOut(
    amp: BigNumberish,
    balances: BigNumberish[],
    tokenIndex: BigNumberish,
    bptAmountIn: BigNumberish,
    bptTotalSupply: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  exactBPTInForTokensOut(
    balances: BigNumberish[],
    bptAmountIn: BigNumberish,
    bptTotalSupply: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  exactTokensInForBPTOut(
    amp: BigNumberish,
    balances: BigNumberish[],
    amountsIn: BigNumberish[],
    bptTotalSupply: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  inGivenOut(
    amp: BigNumberish,
    balances: BigNumberish[],
    tokenIndexIn: BigNumberish,
    tokenIndexOut: BigNumberish,
    tokenAmountOut: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  invariant(
    amp: BigNumberish,
    balances: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  outGivenIn(
    amp: BigNumberish,
    balances: BigNumberish[],
    tokenIndexIn: BigNumberish,
    tokenIndexOut: BigNumberish,
    tokenAmountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenInForExactBPTOut(
    amp: BigNumberish,
    balances: BigNumberish[],
    tokenIndex: BigNumberish,
    bptAmountOut: BigNumberish,
    bptTotalSupply: BigNumberish,
    swapFee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    bptInForExactTokensOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsOut: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateDueTokenProtocolSwapFeeAmount(
      amp: BigNumberish,
      balances: BigNumberish[],
      lastInvariant: BigNumberish,
      tokenIndex: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exactBPTInForTokenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exactBPTInForTokensOut(
      balances: BigNumberish[],
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    exactTokensInForBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsIn: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    inGivenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    invariant(
      amp: BigNumberish,
      balances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    outGivenIn(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenInForExactBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountOut: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    bptInForExactTokensOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsOut: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculateDueTokenProtocolSwapFeeAmount(
      amp: BigNumberish,
      balances: BigNumberish[],
      lastInvariant: BigNumberish,
      tokenIndex: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exactBPTInForTokenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exactBPTInForTokensOut(
      balances: BigNumberish[],
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exactTokensInForBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsIn: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    inGivenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    invariant(
      amp: BigNumberish,
      balances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    outGivenIn(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenInForExactBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountOut: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    bptInForExactTokensOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsOut: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateDueTokenProtocolSwapFeeAmount(
      amp: BigNumberish,
      balances: BigNumberish[],
      lastInvariant: BigNumberish,
      tokenIndex: BigNumberish,
      protocolSwapFeePercentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exactBPTInForTokenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exactBPTInForTokensOut(
      balances: BigNumberish[],
      bptAmountIn: BigNumberish,
      bptTotalSupply: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exactTokensInForBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      amountsIn: BigNumberish[],
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    inGivenOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    invariant(
      amp: BigNumberish,
      balances: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    outGivenIn(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndexIn: BigNumberish,
      tokenIndexOut: BigNumberish,
      tokenAmountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenInForExactBPTOut(
      amp: BigNumberish,
      balances: BigNumberish[],
      tokenIndex: BigNumberish,
      bptAmountOut: BigNumberish,
      bptTotalSupply: BigNumberish,
      swapFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
