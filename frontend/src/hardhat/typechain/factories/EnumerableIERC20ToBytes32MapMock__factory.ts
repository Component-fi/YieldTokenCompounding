/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  EnumerableIERC20ToBytes32MapMock,
  EnumerableIERC20ToBytes32MapMockInterface,
} from "../EnumerableIERC20ToBytes32MapMock";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    name: "OperationResult",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "at",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
    ],
    name: "contains",
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
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256",
      },
    ],
    name: "get",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "length",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
    ],
    name: "remove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "unchecked_at",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "key",
        type: "address",
      },
    ],
    name: "unchecked_indexOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    name: "unchecked_setAt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "unchecked_valueAt",
    outputs: [
      {
        internalType: "bytes32",
        name: "value",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610623806100206000396000f3fe608060405234801561001057600080fd5b506004361061008e5760003560e01c80630127190b146100935780631f7b6d32146100cb57806329092d0e146100d35780633e7b8e71146100fb57806354996d5d146101275780635dbe47e81461014a578063adcd29d914610184578063b464631b146101a1578063c65d2683146101cd578063e0886f901461020d575b600080fd5b6100b9600480360360208110156100a957600080fd5b50356001600160a01b031661022a565b60408051918252519081900360200190f35b6100b961023c565b6100f9600480360360208110156100e957600080fd5b50356001600160a01b031661024d565b005b6100f96004803603604081101561011157600080fd5b506001600160a01b038135169060200135610296565b6100f96004803603604081101561013d57600080fd5b50803590602001356102e1565b6101706004803603602081101561016057600080fd5b50356001600160a01b03166102f1565b604080519115158252519081900360200190f35b6100b96004803603602081101561019a57600080fd5b50356102fd565b6100b9600480360360408110156101b757600080fd5b506001600160a01b038135169060200135610309565b6101ea600480360360208110156101e357600080fd5b503561031d565b604080516001600160a01b03909316835260208301919091528051918290030190f35b6101ea6004803603602081101561022357600080fd5b5035610333565b60006102368183610340565b92915050565b6000610248600061035f565b905090565b60006102598183610363565b60408051821515815290519192507fed9840e0775590557ad736875d96c95cf1458b766335f74339951a32c82a9e33919081900360200190a15050565b60006102a381848461040f565b60408051821515815290519192507fed9840e0775590557ad736875d96c95cf1458b766335f74339951a32c82a9e33919081900360200190a1505050565b6102ed600083836104be565b5050565b600061023681836104d6565b600061023681836104f7565b600061031681848461050d565b9392505050565b60008061032a818461054a565b91509150915091565b60008061032a818461056e565b6001600160a01b03166000908152600291909101602052604090205490565b5490565b6001600160a01b0381166000908152600283016020526040812054801561040557835460001990810160008181526001878101602090815260408084209587018452808420865481546001600160a01b03199081166001600160a01b0392831617835588860180549387019390935588548216875260028d018086528488209a909a558854169097558490559389559387168252939092528120559050610236565b6000915050610236565b6001600160a01b03821660009081526002840160205260408120548061049c57505082546040805180820182526001600160a01b03858116808352602080840187815260008781526001808c018452878220965187546001600160a01b03191696169590951786559051948401949094559482018089559083526002880190945291902091909155610316565b6000190160009081526001808601602052604082200183905590509392505050565b60009182526001928301602052604090912090910155565b6001600160a01b031660009081526002919091016020526040902054151590565b6000908152600191820160205260409020015490565b6001600160a01b038216600090815260028401602052604081205461053481151584610597565b61054185600183036104f7565b95945050505050565b600090815260019182016020526040902080549101546001600160a01b0390911691565b600080610582838560000154116064610597565b61058c848461054a565b915091509250929050565b816102ed5762461bcd60e51b600090815260206004526007602452600a808304818104828106603090810160101b848706949093060160081b92909201016642414c230000300160c81b6044526102ed91606490fdfea2646970667358221220f21464f37962aec0c5433721a3edd05f27532c3a406feff81c1972dbe0aaaa2c64736f6c63430007030033";

export class EnumerableIERC20ToBytes32MapMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EnumerableIERC20ToBytes32MapMock> {
    return super.deploy(
      overrides || {}
    ) as Promise<EnumerableIERC20ToBytes32MapMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): EnumerableIERC20ToBytes32MapMock {
    return super.attach(address) as EnumerableIERC20ToBytes32MapMock;
  }
  connect(signer: Signer): EnumerableIERC20ToBytes32MapMock__factory {
    return super.connect(signer) as EnumerableIERC20ToBytes32MapMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EnumerableIERC20ToBytes32MapMockInterface {
    return new utils.Interface(
      _abi
    ) as EnumerableIERC20ToBytes32MapMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EnumerableIERC20ToBytes32MapMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as EnumerableIERC20ToBytes32MapMock;
  }
}
