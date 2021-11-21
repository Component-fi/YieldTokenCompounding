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
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface YTCSendPTInterface extends ethers.utils.Interface {
  functions: {
    "approveTranchePTOnBalancer(address)": FunctionFragment;
    "balVault()": FunctionFragment;
    "compound(uint8,address,bytes32,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approveTranchePTOnBalancer",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "balVault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "compound",
    values: [BigNumberish, string, BytesLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveTranchePTOnBalancer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "compound", data: BytesLike): Result;

  events: {};
}

export class YTCSendPT extends BaseContract {
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

  interface: YTCSendPTInterface;

  functions: {
    approveTranchePTOnBalancer(
      _trancheAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balVault(overrides?: CallOverrides): Promise<[string]>;

    compound(
      _n: BigNumberish,
      _trancheAddress: string,
      _balancerPoolId: BytesLike,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  approveTranchePTOnBalancer(
    _trancheAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balVault(overrides?: CallOverrides): Promise<string>;

  compound(
    _n: BigNumberish,
    _trancheAddress: string,
    _balancerPoolId: BytesLike,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approveTranchePTOnBalancer(
      _trancheAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    balVault(overrides?: CallOverrides): Promise<string>;

    compound(
      _n: BigNumberish,
      _trancheAddress: string,
      _balancerPoolId: BytesLike,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    approveTranchePTOnBalancer(
      _trancheAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balVault(overrides?: CallOverrides): Promise<BigNumber>;

    compound(
      _n: BigNumberish,
      _trancheAddress: string,
      _balancerPoolId: BytesLike,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveTranchePTOnBalancer(
      _trancheAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    compound(
      _n: BigNumberish,
      _trancheAddress: string,
      _balancerPoolId: BytesLike,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
