/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockStableMath,
  MockStableMathInterface,
} from "../MockStableMath";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptTotalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "bptInForExactTokensOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "lastInvariant",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "protocolSwapFeePercentage",
        type: "uint256",
      },
    ],
    name: "calculateDueTokenProtocolSwapFeeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "tokenIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptTotalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "exactBPTInForTokenOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptTotalSupply",
        type: "uint256",
      },
    ],
    name: "exactBPTInForTokensOut",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptTotalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "exactTokensInForBPTOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "tokenIndexIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenIndexOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenAmountOut",
        type: "uint256",
      },
    ],
    name: "inGivenOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
    ],
    name: "invariant",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "tokenIndexIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenIndexOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenAmountIn",
        type: "uint256",
      },
    ],
    name: "outGivenIn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amp",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "tokenIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bptTotalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "swapFee",
        type: "uint256",
      },
    ],
    name: "tokenInForExactBPTOut",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611750806100206000396000f3fe608060405234801561001057600080fd5b50600436106100835760003560e01c8063155bfcb8146100885780631c855fa614610142578063405de978146102385780636fc82f29146102f15780639cd91d3f14610420578063a89d4259146104d3578063cf1b8c8c14610602578063db7ad3f2146106bb578063fe2dd7ba1461076e575b600080fd5b6101306004803603604081101561009e57600080fd5b81359190810190604081016020820135600160201b8111156100bf57600080fd5b8201836020820111156100d157600080fd5b803590602001918460208302840111600160201b831117156100f257600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610821945050505050565b60408051918252519081900360200190f35b6101e86004803603606081101561015857600080fd5b810190602081018135600160201b81111561017257600080fd5b82018360208201111561018457600080fd5b803590602001918460208302840111600160201b831117156101a557600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295505082359350505060200135610836565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561022457818101518382015260200161020c565b505050509050019250505060405180910390f35b610130600480360360c081101561024e57600080fd5b81359190810190604081016020820135600160201b81111561026f57600080fd5b82018360208201111561028157600080fd5b803590602001918460208302840111600160201b831117156102a257600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550508235935050506020810135906040810135906060013561084b565b610130600480360360a081101561030757600080fd5b81359190810190604081016020820135600160201b81111561032857600080fd5b82018360208201111561033a57600080fd5b803590602001918460208302840111600160201b8311171561035b57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b8111156103aa57600080fd5b8201836020820111156103bc57600080fd5b803590602001918460208302840111600160201b831117156103dd57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295505082359350505060200135610866565b610130600480360360a081101561043657600080fd5b81359190810190604081016020820135600160201b81111561045757600080fd5b82018360208201111561046957600080fd5b803590602001918460208302840111600160201b8311171561048a57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550508235935050506020810135906040013561087f565b610130600480360360a08110156104e957600080fd5b81359190810190604081016020820135600160201b81111561050a57600080fd5b82018360208201111561051c57600080fd5b803590602001918460208302840111600160201b8311171561053d57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561058c57600080fd5b82018360208201111561059e57600080fd5b803590602001918460208302840111600160201b831117156105bf57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550508235935050506020013561088e565b610130600480360360c081101561061857600080fd5b81359190810190604081016020820135600160201b81111561063957600080fd5b82018360208201111561064b57600080fd5b803590602001918460208302840111600160201b8311171561066c57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550508235935050506020810135906040810135906060013561089d565b610130600480360360a08110156106d157600080fd5b81359190810190604081016020820135600160201b8111156106f257600080fd5b82018360208201111561070457600080fd5b803590602001918460208302840111600160201b8311171561072557600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092955050823593505050602081013590604001356108ad565b610130600480360360a081101561078457600080fd5b81359190810190604081016020820135600160201b8111156107a557600080fd5b8201836020820111156107b757600080fd5b803590602001918460208302840111600160201b831117156107d857600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092955050823593505050602081013590604001356108bc565b600061082d83836108cb565b90505b92915050565b6060610843848484610a45565b949350505050565b600061085b878787878787610af6565b979650505050505050565b60006108758686868686610c0a565b9695505050505050565b60006108758686868686610e96565b60006108758686868686610f3c565b600061085b8787878787876111bb565b6000610875868686868661126d565b600061087586868686866112c9565b80516000908190815b8181101561090c576109028582815181106108eb57fe5b60200260200101518461134d90919063ffffffff16565b92506001016108d4565b508161091d57600092505050610830565b6000828161092b888561135f565b905060005b60ff811015610a38576000610959868a60008151811061094c57fe5b602002602001015161135f565b905060015b868110156109925761098861098261097c848d858151811061094c57fe5b8961135f565b86611383565b915060010161095e565b508394506109f26109c86109af6109a9868b61135f565b8461135f565b6109c26109bc8a8961135f565b8861135f565b9061134d565b6109ed6109df6109d98760016113b6565b8561135f565b6109c261097c8b600161134d565b611383565b935084841115610a18576001610a0885876113b6565b11610a135750610a38565b610a2f565b6001610a2486866113b6565b11610a2f5750610a38565b50600101610930565b5090979650505050505050565b60606000610a5384846113cc565b9050606085516001600160401b0381118015610a6e57600080fd5b50604051908082528060200260200182016040528015610a98578160200160208202803683370190505b50905060005b8651811015610aec57610acd83888381518110610ab757fe5b602002602001015161141d90919063ffffffff16565b828281518110610ad957fe5b6020908102919091010152600101610a9e565b5095945050505050565b600080610b0388886108cb565b90506000610b2582610b1f87610b19818b61134d565b90611449565b90611497565b90506000805b8951811015610b6457610b5a8a8281518110610b4357fe5b60200260200101518361134d90919063ffffffff16565b9150600101610b2b565b506000610b738b8b858c6114d3565b90506000610b9d8b8b81518110610b8657fe5b6020026020010151836113b690919063ffffffff16565b90506000610bc7848d8d81518110610bb157fe5b60200260200101516113cc90919063ffffffff16565b90506000610bd48261166f565b90506000610be28a83611497565b9050610bf7610bf08261166f565b8590611449565b9f9e505050505050505050505050505050565b600080610c1787876108cb565b90506000805b8751811015610c3f57610c35888281518110610b4357fe5b9150600101610c1d565b50606086516001600160401b0381118015610c5957600080fd5b50604051908082528060200260200182016040528015610c83578160200160208202803683370190505b5090506000805b8951811015610d3a576000610ca5858c8481518110610bb157fe5b9050610cfd8b8381518110610cb657fe5b6020026020010151610cf78c8581518110610ccd57fe5b60200260200101518e8681518110610ce157fe5b602002602001015161134d90919063ffffffff16565b906113cc565b848381518110610d0957fe5b602002602001018181525050610d2f610d2882868581518110610ab757fe5b849061134d565b925050600101610c8a565b50606089516001600160401b0381118015610d5457600080fd5b50604051908082528060200260200182016040528015610d7e578160200160208202803683370190505b50905060005b8a51811015610e51576000848281518110610d9b57fe5b60200260200101518410610db157506000610df5565b610df2610de2670de0b6b3a7640000878581518110610dcc57fe5b60200260200101516113b690919063ffffffff16565b610b1986888681518110610dcc57fe5b90505b6000610e018a83611497565b90506000610e1d610e118361166f565b8e8681518110610ab757fe5b9050610e2f818f8681518110610ce157fe5b858581518110610e3b57fe5b6020908102919091010152505050600101610d84565b506000610e5e8c836108cb565b9050610e86610e7f670de0b6b3a7640000610e79848a6113cc565b906113b6565b8a9061141d565b9c9b505050505050505050505050565b600080610ea387876108cb565b9050610eb583878681518110610dcc57fe5b868581518110610ec157fe5b6020026020010181815250506000610edb888884896114d3565b9050610eed84888781518110610ce157fe5b878681518110610ef957fe5b602002602001018181525050610f3060016109c2898981518110610f1957fe5b6020026020010151846113b690919063ffffffff16565b98975050505050505050565b600080610f4987876108cb565b90506000805b8751811015610f7157610f67888281518110610b4357fe5b9150600101610f4f565b50606086516001600160401b0381118015610f8b57600080fd5b50604051908082528060200260200182016040528015610fb5578160200160208202803683370190505b5090506000805b8951811015611075576000610fed858c8481518110610fd757fe5b602002602001015161144990919063ffffffff16565b90506110298b8381518110610ffe57fe5b6020026020010151610b198c858151811061101557fe5b60200260200101518e8681518110610dcc57fe5b84838151811061103557fe5b60200260200101818152505061106a610d288286858151811061105457fe5b602002602001015161149790919063ffffffff16565b925050600101610fbc565b50606089516001600160401b038111801561108f57600080fd5b506040519080825280602002602001820160405280156110b9578160200160208202803683370190505b50905060005b8a518110156111905760008482815181106110d657fe5b602002602001015184116110ec57506000611134565b61113161110b8684815181106110fe57fe5b602002602001015161166f565b610b1987858151811061111a57fe5b6020026020010151876113b690919063ffffffff16565b90505b60006111408a83611497565b9050600061115c6111508361166f565b8e8681518110610fd757fe5b905061116e818f8681518110610dcc57fe5b85858151811061117a57fe5b60209081029190910101525050506001016110bf565b50600061119d8c836108cb565b9050610e866111b46111af8389611449565b61166f565b8a90611497565b6000806111c888886108cb565b905060006111de82610b1f87610b19818b6113b6565b90506000805b8951811015611206576111fc8a8281518110610b4357fe5b91506001016111e4565b5060006112158b8b858c6114d3565b90506000611229828c8c81518110610dcc57fe5b9050600061123d848d8d81518110610bb157fe5b9050600061124a8261166f565b905060006112588a83611497565b9050610bf76112668261166f565b859061141d565b60008061127c878787876114d3565b905060008187868151811061128d57fe5b6020026020010151116112a15760006112b1565b6112b182888781518110610dcc57fe5b9050610f30670de0b6b3a7640000610cf7838761141d565b6000806112d687876108cb565b90506112e883878781518110610ce157fe5b8686815181106112f457fe5b602002602001018181525050600061130e888884886114d3565b905061132084888881518110610dcc57fe5b87878151811061132c57fe5b602002602001018181525050610f306001610e79838a8981518110610dcc57fe5b600082820161082d8482101583611695565b600082820261082d84158061137c57508385838161137957fe5b04145b6003611695565b60006113928215156004611695565b8261139f57506000610830565b8160018403816113ab57fe5b046001019050610830565b60006113c6838311156001611695565b50900390565b60006113db8215156004611695565b826113e857506000610830565b670de0b6b3a76400008381029061140b9085838161140257fe5b04146005611695565b82818161141457fe5b04915050610830565b600082820261143784158061137c57508385838161137957fe5b670de0b6b3a764000090049392505050565b60006114588215156004611695565b8261146557506000610830565b670de0b6b3a76400008381029061147f9085838161140257fe5b82600182038161148b57fe5b04600101915050610830565b60008282026114b184158061137c57508385838161137957fe5b806114c0576000915050610830565b670de0b6b3a7640000600019820161148b565b6000806114e186865161135f565b90506000856000815181106114f257fe5b60200260200101519050600061151087518860008151811061094c57fe5b905060015b875181101561155c5761154161153b611534848b858151811061094c57fe5b8a5161135f565b886116a7565b91506115528882815181106108eb57fe5b9250600101611515565b5061156c878681518110610b8657fe5b9150600061158361157d888961135f565b85611383565b90506115af82610b198a898151811061159857fe5b60200260200101518461149790919063ffffffff16565b905060006115c76115c089876113cc565b859061134d565b90506000806115e76115d98b8561134d565b610b19866109c28e80611497565b905060005b60ff81101561165f5781925061161c61160e8c610e79876109c287600261135f565b610b19876109c28680611497565b91508282111561164157600161163283856113b6565b1161163c5761165f565b611657565b600161164d84846113b6565b116116575761165f565b6001016115ec565b509b9a5050505050505050505050565b6000670de0b6b3a76400008210611687576000610830565b50670de0b6b3a76400000390565b816116a3576116a3816116c7565b5050565b60006116b68215156004611695565b8183816116bf57fe5b049392505050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fdfea2646970667358221220fc64483e2c8b1c51598f6090e1abdcfe950ac7e9320ca99454eb0fa0238d393664736f6c63430007030033";

export class MockStableMath__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockStableMath> {
    return super.deploy(overrides || {}) as Promise<MockStableMath>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockStableMath {
    return super.attach(address) as MockStableMath;
  }
  connect(signer: Signer): MockStableMath__factory {
    return super.connect(signer) as MockStableMath__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockStableMathInterface {
    return new utils.Interface(_abi) as MockStableMathInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockStableMath {
    return new Contract(address, _abi, signerOrProvider) as MockStableMath;
  }
}
