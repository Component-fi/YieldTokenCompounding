/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FactoryWidePauseWindow,
  FactoryWidePauseWindowInterface,
} from "../FactoryWidePauseWindow";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getPauseConfiguration",
    outputs: [
      {
        internalType: "uint256",
        name: "pauseWindowDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bufferPeriodDuration",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b50426276a7000160805260805160f461003560003980604e52806076525060f46000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632da47c4014602d575b600080fd5b60336048565b604051603f92919060b0565b60405180910390f35b600080427f000000000000000000000000000000000000000000000000000000000000000081101560a257807f000000000000000000000000000000000000000000000000000000000000000003925062278d00915060ab565b60009250600091505b509091565b91825260208201526040019056fea26469706673582212204fa67f89ea77a7ab778c6535e679613f9962bc1b74fd9bda55ec81d5956f00d064736f6c63430007030033";

export class FactoryWidePauseWindow__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FactoryWidePauseWindow> {
    return super.deploy(overrides || {}) as Promise<FactoryWidePauseWindow>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): FactoryWidePauseWindow {
    return super.attach(address) as FactoryWidePauseWindow;
  }
  connect(signer: Signer): FactoryWidePauseWindow__factory {
    return super.connect(signer) as FactoryWidePauseWindow__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FactoryWidePauseWindowInterface {
    return new utils.Interface(_abi) as FactoryWidePauseWindowInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FactoryWidePauseWindow {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FactoryWidePauseWindow;
  }
}