/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  YieldTokenCompounding,
  YieldTokenCompoundingInterface,
} from "../YieldTokenCompounding";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_balVault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_trancheAddress",
        type: "address",
      },
    ],
    name: "approveTranchePTOnBalancer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "balVault",
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
        internalType: "uint8",
        name: "_n",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_trancheAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_balancerPoolId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "compound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60c060405260001960a05234801561001657600080fd5b50604051610b81380380610b818339810160408190526100359161004a565b60601b6001600160601b031916608052610078565b60006020828403121561005b578081fd5b81516001600160a01b0381168114610071578182fd5b9392505050565b60805160601c60a051610ad56100ac600039806104cc52806106bb525080609c52806104aa52806106df5250610ad56000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806377aba2131461004657806378e216bd14610064578063bfe75b8614610085575b600080fd5b61004e61009a565b60405161005b9190610955565b60405180910390f35b61007761007236600461088b565b6100be565b60405161005b929190610a79565b6100986100933660046107f1565b610484565b005b7f000000000000000000000000000000000000000000000000000000000000000081565b60008060008660ff161180156100d75750601f8660ff16105b6100fc5760405162461bcd60e51b81526004016100f3906109a6565b60405180910390fd5b60008590506000816001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b15801561013c57600080fd5b505afa158015610150573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101749190610834565b90506000826001600160a01b03166309218e916040518163ffffffff1660e01b815260040160206040518083038186803b1580156101b157600080fd5b505afa1580156101c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101e99190610834565b9050826001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b15801561022457600080fd5b505afa158015610238573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061025c9190610834565b6001600160a01b03166323b872dd3383896040518463ffffffff1660e01b815260040161028b93929190610969565b602060405180830381600087803b1580156102a557600080fd5b505af11580156102b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102dd9190610814565b50600060018a60ff1611156103f0576102fc60018b03858a868661054b565b9050836001600160a01b031663764b666c6040518163ffffffff1660e01b815260040160206040518083038186803b15801561033757600080fd5b505afa15801561034b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061036f9190610834565b6001600160a01b031663a9059cbb33836040518363ffffffff1660e01b815260040161039c92919061098d565b602060405180830381600087803b1580156103b657600080fd5b505af11580156103ca573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ee9190610814565b505b600080856001600160a01b03166385f45c88336040518263ffffffff1660e01b815260040161041f9190610955565b6040805180830381600087803b15801561043857600080fd5b505af115801561044c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104709190610868565b909d93019b50919950505050505050505050565b60405163095ea7b360e01b815281906001600160a01b0382169063095ea7b3906104f4907f0000000000000000000000000000000000000000000000000000000000000000907f00000000000000000000000000000000000000000000000000000000000000009060040161098d565b602060405180830381600087803b15801561050e57600080fd5b505af1158015610522573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105469190610814565b505050565b600080805b8760ff168160ff16101561060057600080886001600160a01b03166385f45c88306040518263ffffffff1660e01b815260040161058d9190610955565b6040805180830381600087803b1580156105a657600080fd5b505af11580156105ba573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105de9190610868565b9150915080840193506105f5898989308a8761060b565b505050600101610550565b509695505050505050565b6000808786610618610781565b6040518060c001604052808b815260200185600181111561063557fe5b8152602001846001600160a01b03168152602001836001600160a01b0316815260200187815260200160405180602001604052806000815250815250905061067b6107ca565b50604080516080810182526001600160a01b03808b1682526000602083018190528a8216838501526060830181905292516352bbbe2960e01b81529192917f00000000000000000000000000000000000000000000000000000000000000009183917f0000000000000000000000000000000000000000000000000000000000000000909116906352bbbe299061071c9088908890869088906004016109ed565b602060405180830381600087803b15801561073657600080fd5b505af115801561074a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061076e9190610850565b9f9e505050505050505050505050505050565b6040805160c0810190915260008082526020820190815260200160006001600160a01b0316815260200160006001600160a01b0316815260200160008152602001606081525090565b60408051608081018252600080825260208201819052918101829052606081019190915290565b600060208284031215610802578081fd5b813561080d81610a87565b9392505050565b600060208284031215610825578081fd5b8151801515811461080d578182fd5b600060208284031215610845578081fd5b815161080d81610a87565b600060208284031215610861578081fd5b5051919050565b6000806040838503121561087a578081fd5b505080516020909101519092909150565b600080600080608085870312156108a0578182fd5b843560ff811681146108b0578283fd5b935060208501356108c081610a87565b93969395505050506040820135916060013590565b60008151808452815b818110156108fa576020818501810151868301820152016108de565b8181111561090b5782602083870101525b50601f01601f19169290920160200192915050565b80516001600160a01b039081168352602080830151151590840152604080830151909116908301526060908101511515910152565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03929092168252602082015260400190565b60208082526027908201527f6e2068617320746f206265206265747765656e203120746f2032353520696e63604082015266363ab9b4bb329760c91b606082015260800190565b600060e08252855160e0830152602086015160028110610a0957fe5b61010083015260408601516001600160a01b03908116610120840152606087015116610140830152608086015161016083015260a086015160c0610180840152610a576101a08401826108d5565b915050610a676020830186610920565b60a082019390935260c0015292915050565b918252602082015260400190565b6001600160a01b0381168114610a9c57600080fd5b5056fea2646970667358221220ea9bf6903c8771aa32f4b205c8a156966205d00c2a1a80b453c952ba59a95b8064736f6c63430007030033";

export class YieldTokenCompounding__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _balVault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<YieldTokenCompounding> {
    return super.deploy(
      _balVault,
      overrides || {}
    ) as Promise<YieldTokenCompounding>;
  }
  getDeployTransaction(
    _balVault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_balVault, overrides || {});
  }
  attach(address: string): YieldTokenCompounding {
    return super.attach(address) as YieldTokenCompounding;
  }
  connect(signer: Signer): YieldTokenCompounding__factory {
    return super.connect(signer) as YieldTokenCompounding__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): YieldTokenCompoundingInterface {
    return new utils.Interface(_abi) as YieldTokenCompoundingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): YieldTokenCompounding {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as YieldTokenCompounding;
  }
}
