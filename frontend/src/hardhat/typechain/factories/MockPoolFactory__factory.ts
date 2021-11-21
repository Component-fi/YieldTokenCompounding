/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockPoolFactory,
  MockPoolFactoryInterface,
} from "../MockPoolFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getVault",
    outputs: [
      {
        internalType: "contract IVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "isPoolFromFactory",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405161031b38038061031b83398101604081905261002f91610044565b60601b6001600160601b031916608052610072565b600060208284031215610055578081fd5b81516001600160a01b038116811461006b578182fd5b9392505050565b60805160601c61028d61008e6000398060ac525061028d6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80636634b753146100465780638d928af81461006f578063efc81a8c14610084575b600080fd5b610059610054366004610162565b61008c565b60405161006691906101a4565b60405180910390f35b6100776100aa565b6040516100669190610190565b6100776100ce565b6001600160a01b031660009081526020819052604090205460ff1690565b7f000000000000000000000000000000000000000000000000000000000000000090565b6000806040516100dd90610156565b604051809103906000f0801580156100f9573d6000803e3d6000fd5b5090506101058161010a565b905090565b6001600160a01b038116600081815260208190526040808220805460ff19166001179055517f83a48fbcfc991335314e74d0496aab6a1987e992ddc85dddbcc4d6dd6ef2e9fc9190a250565b60a8806101b083390190565b600060208284031215610173578081fd5b81356001600160a01b0381168114610189578182fd5b9392505050565b6001600160a01b0391909116815260200190565b90151581526020019056fe6080604052348015600f57600080fd5b50608a8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806338fff2d014602d575b600080fd5b60336047565b604051603e9190604b565b60405180910390f35b3090565b9081526020019056fea2646970667358221220129b486446fdff6033ec0d3e9074e241ac8fd1994f066fe14039a7942d5a59b964736f6c63430007030033a2646970667358221220dafcc22fbe8e8d9fbb34c5ae6495ea8eb329645e302b1505336c063fe69e0c8e64736f6c63430007030033";

export class MockPoolFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockPoolFactory> {
    return super.deploy(_vault, overrides || {}) as Promise<MockPoolFactory>;
  }
  getDeployTransaction(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_vault, overrides || {});
  }
  attach(address: string): MockPoolFactory {
    return super.attach(address) as MockPoolFactory;
  }
  connect(signer: Signer): MockPoolFactory__factory {
    return super.connect(signer) as MockPoolFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockPoolFactoryInterface {
    return new utils.Interface(_abi) as MockPoolFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockPoolFactory {
    return new Contract(address, _abi, signerOrProvider) as MockPoolFactory;
  }
}
