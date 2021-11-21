/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TemporarilyPausableMock,
  TemporarilyPausableMockInterface,
} from "../TemporarilyPausableMock";

const _abi = [
  {
    inputs: [
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
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
    ],
    name: "PausedStateChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "getPausedState",
    outputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "pauseWindowEndTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bufferPeriodEndTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
    ],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b506040516103363803806103368339818101604052604081101561003357600080fd5b50805160209091015181816100506276a700831115610194610077565b61006262278d00821115610195610077565b4290910160808190520160a052506100dc9050565b816100855761008581610089565b5050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b60805160a0516102376100ff6000398061017a52508061015652506102376000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806316c38b3c1461003b5780631c0de0511461005c575b600080fd5b61005a6004803603602081101561005157600080fd5b50351515610084565b005b610064610090565b604080519315158452602084019290925282820152519081900360600190f35b61008d816100b9565b50565b600080600061009d610135565b1592506100a8610154565b91506100b2610178565b9050909192565b80156100d9576100d46100ca610154565b421061019361019c565b6100ee565b6100ee6100e4610178565b42106101a961019c565b6000805482151560ff19909116811790915560408051918252517f9e3a5e37224532dea67b89face185703738a228a6e8a23dee546960180d3be649181900360200190a150565b600061013f610178565b42118061014f575060005460ff16155b905090565b7f000000000000000000000000000000000000000000000000000000000000000090565b7f000000000000000000000000000000000000000000000000000000000000000090565b816101aa576101aa816101ae565b5050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fdfea264697066735822122030b53fb60cdc6700b1bfc96fa555b912feb1665c80672b3832d070d5a9e81b5164736f6c63430007030033";

export class TemporarilyPausableMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    pauseWindowDuration: BigNumberish,
    bufferPeriodDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TemporarilyPausableMock> {
    return super.deploy(
      pauseWindowDuration,
      bufferPeriodDuration,
      overrides || {}
    ) as Promise<TemporarilyPausableMock>;
  }
  getDeployTransaction(
    pauseWindowDuration: BigNumberish,
    bufferPeriodDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      pauseWindowDuration,
      bufferPeriodDuration,
      overrides || {}
    );
  }
  attach(address: string): TemporarilyPausableMock {
    return super.attach(address) as TemporarilyPausableMock;
  }
  connect(signer: Signer): TemporarilyPausableMock__factory {
    return super.connect(signer) as TemporarilyPausableMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TemporarilyPausableMockInterface {
    return new utils.Interface(_abi) as TemporarilyPausableMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TemporarilyPausableMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TemporarilyPausableMock;
  }
}
