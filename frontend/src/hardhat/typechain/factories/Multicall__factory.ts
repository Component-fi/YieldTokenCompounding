/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Multicall, MulticallInterface } from "../Multicall";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockCoinbase",
    outputs: [
      {
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockDifficulty",
    outputs: [
      {
        internalType: "uint256",
        name: "difficulty",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockGasLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "gaslimit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061056b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100785760003560e01c80630f28c97d1461007d578063252dba421461009b57806327e86d6e146100bc5780634d2301cc146100c457806372425d9d146100d757806386d516e8146100df578063a8b0574e146100e7578063ee82ac5e146100fc575b600080fd5b61008561010f565b6040516100929190610433565b60405180910390f35b6100ae6100a93660046102b5565b610113565b604051610092929190610461565b610085610252565b6100856100d2366004610294565b61025b565b610085610268565b61008561026c565b6100ef610270565b604051610092919061041f565b61008561010a3660046103eb565b610274565b4290565b8051439060609067ffffffffffffffff8111801561013057600080fd5b5060405190808252806020026020018201604052801561016457816020015b606081526020019060019003908161014f5790505b50905060005b835181101561024c576000606085838151811061018357fe5b6020026020010151600001516001600160a01b03168684815181106101a457fe5b6020026020010151602001516040516101bd9190610403565b6000604051808303816000865af19150503d80600081146101fa576040519150601f19603f3d011682016040523d82523d6000602084013e6101ff565b606091505b50915091508161022a5760405162461bcd60e51b81526004016102219061043c565b60405180910390fd5b8084848151811061023757fe5b6020908102919091010152505060010161016a565b50915091565b60001943014090565b6001600160a01b03163190565b4490565b4590565b4190565b4090565b80356001600160a01b038116811461028f57600080fd5b919050565b6000602082840312156102a5578081fd5b6102ae82610278565b9392505050565b600060208083850312156102c7578182fd5b67ffffffffffffffff80843511156102dd578283fd5b8335840185601f8201126102ef578384fd5b8035828111156102fb57fe5b61030884858302016104e1565b81815284810190838601875b848110156103dc5781358601601f196040828e0382011215610334578a8bfd5b604051604081018181108b8211171561034957fe5b604052610357838c01610278565b815260408301358a81111561036a578c8dfd5b8084019350508d603f84011261037e578b8cfd5b8a8301358a81111561038c57fe5b61039c8c84601f840116016104e1565b92508083528e60408286010111156103b2578c8dfd5b80604085018d85013782018b018c9052808b01919091528552509287019290870190600101610314565b50909998505050505050505050565b6000602082840312156103fc578081fd5b5035919050565b60008251610415818460208701610505565b9190910192915050565b6001600160a01b0391909116815260200190565b90815260200190565b6020808252600b908201526a10d0531317d1905253115160aa1b604082015260600190565b600060408201848352602060408185015281855180845260608601915060608382028701019350828701855b828110156104d357878603605f19018452815180518088526104b481888a01898501610505565b601f01601f19169690960185019550928401929084019060010161048d565b509398975050505050505050565b60405181810167ffffffffffffffff811182821017156104fd57fe5b604052919050565b60005b83811015610520578181015183820152602001610508565b8381111561052f576000848401525b5050505056fea2646970667358221220b0a215a956477262df99d2b7e80e792b9ff3017a45c908058512798d1163268764736f6c63430007030033";

export class Multicall__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Multicall> {
    return super.deploy(overrides || {}) as Promise<Multicall>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Multicall {
    return super.attach(address) as Multicall;
  }
  connect(signer: Signer): Multicall__factory {
    return super.connect(signer) as Multicall__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MulticallInterface {
    return new utils.Interface(_abi) as MulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Multicall {
    return new Contract(address, _abi, signerOrProvider) as Multicall;
  }
}
