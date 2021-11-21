/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockWeightedMath,
  MockWeightedMathInterface,
} from "../MockWeightedMath";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "normalizedWeights",
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
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "normalizedWeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "previousInvariant",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "currentInvariant",
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
        name: "tokenBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenNormalizedWeight",
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
        name: "currentBalances",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalBPT",
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
        internalType: "uint256[]",
        name: "balances",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "normalizedWeights",
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
        name: "tokenBalanceIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenWeightIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenBalanceOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenWeightOut",
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
        internalType: "uint256[]",
        name: "normalizedWeights",
        type: "uint256[]",
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
        name: "tokenBalanceIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenWeightIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenBalanceOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenWeightOut",
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
        name: "tokenBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenNormalizedWeight",
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
  "0x608060405234801561001057600080fd5b50611c09806100206000396000f3fe608060405234801561001057600080fd5b50600436106100835760003560e01c80631b02e9a8146100885780631c855fa6146100cf5780632e752149146101c55780634b114ddf1461036f57806356785371146103a45780635b55b24a146104c757806398f59bca146104fc578063c2546cc3146106a6578063fab3b9d7146106db575b600080fd5b6100bd600480360360a081101561009e57600080fd5b5080359060208101359060408101359060608101359060800135610710565b60408051918252519081900360200190f35b610175600480360360608110156100e557600080fd5b810190602081018135600160201b8111156100ff57600080fd5b82018360208201111561011157600080fd5b803590602001918460208302840111600160201b8311171561013257600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550508235935050506020013561072b565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156101b1578181015183820152602001610199565b505050509050019250505060405180910390f35b6100bd600480360360a08110156101db57600080fd5b810190602081018135600160201b8111156101f557600080fd5b82018360208201111561020757600080fd5b803590602001918460208302840111600160201b8311171561022857600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561027757600080fd5b82018360208201111561028957600080fd5b803590602001918460208302840111600160201b831117156102aa57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b8111156102f957600080fd5b82018360208201111561030b57600080fd5b803590602001918460208302840111600160201b8311171561032c57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295505082359350505060200135610740565b6100bd600480360360a081101561038557600080fd5b508035906020810135906040810135906060810135906080013561074f565b6100bd600480360360408110156103ba57600080fd5b810190602081018135600160201b8111156103d457600080fd5b8201836020820111156103e657600080fd5b803590602001918460208302840111600160201b8311171561040757600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561045657600080fd5b82018360208201111561046857600080fd5b803590602001918460208302840111600160201b8311171561048957600080fd5b91908080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525092955061075e945050505050565b6100bd600480360360a08110156104dd57600080fd5b5080359060208101359060408101359060608101359060800135610773565b6100bd600480360360a081101561051257600080fd5b810190602081018135600160201b81111561052c57600080fd5b82018360208201111561053e57600080fd5b803590602001918460208302840111600160201b8311171561055f57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b8111156105ae57600080fd5b8201836020820111156105c057600080fd5b803590602001918460208302840111600160201b831117156105e157600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561063057600080fd5b82018360208201111561064257600080fd5b803590602001918460208302840111600160201b8311171561066357600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295505082359350505060200135610782565b6100bd600480360360a08110156106bc57600080fd5b5080359060208101359060408101359060608101359060800135610791565b6100bd600480360360a08110156106f157600080fd5b50803590602081013590604081013590606081013590608001356107a0565b600061071f86868686866107af565b90505b95945050505050565b6060610738848484610833565b949350505050565b600061071f86868686866108e5565b600061071f8686868686610b4a565b600061076a8383610bb7565b90505b92915050565b600061071f8686868686610c22565b600061071f8686868686610cdf565b600061071f8686868686610ec4565b600061071f8686868686610f66565b60006107d16107c685670429d069189e0000610fda565b831115610131611010565b60006107e76107e08685611022565b8690611038565b905060006107f58588611038565b90506000610803838361108f565b9050600061081982670de0b6b3a7640000611022565b90506108258a826110c2565b9a9950505050505050505050565b6060600061084184846110fe565b90506060855167ffffffffffffffff8111801561085d57600080fd5b50604051908082528060200260200182016040528015610887578160200160208202803683370190505b50905060005b86518110156108db576108bc838883815181106108a657fe5b6020026020010151610fda90919063ffffffff16565b8282815181106108c857fe5b602090810291909101015260010161088d565b5095945050505050565b60006060845167ffffffffffffffff8111801561090157600080fd5b5060405190808252806020026020018201604052801561092b578160200160208202803683370190505b5090506000805b88518110156109e05761099189828151811061094a57fe5b602002602001015161098b89848151811061096157fe5b60200260200101518c858151811061097557fe5b602002602001015161114690919063ffffffff16565b906110fe565b83828151811061099d57fe5b6020026020010181815250506109d66109cf8983815181106109bb57fe5b60200260200101518584815181106108a657fe5b8390611146565b9150600101610932565b50670de0b6b3a764000060005b8951811015610b0857600083858381518110610a0557fe5b60200260200101511115610a8a576000610a36610a2a86670de0b6b3a7640000611022565b8d85815181106108a657fe5b90506000610a60828c8681518110610a4a57fe5b602002602001015161102290919063ffffffff16565b9050610a816109cf610a7a670de0b6b3a76400008c611022565b8390610fda565b92505050610aa1565b888281518110610a9657fe5b602002602001015190505b6000610aca8c8481518110610ab257fe5b602002602001015161098b848f878151811061097557fe5b9050610afc610af58c8581518110610ade57fe5b60200260200101518361115890919063ffffffff16565b8590610fda565b935050506001016109ed565b50670de0b6b3a76400008110610b3e57610b34610b2d82670de0b6b3a7640000611022565b8790610fda565b9350505050610722565b60009350505050610722565b6000610b6c610b6187670429d069189e0000610fda565b831115610130611010565b6000610b788784611146565b90506000610b868883611038565b90506000610b9488876110fe565b90506000610ba2838361108f565b9050610825610bb0826111a0565b8990610fda565b670de0b6b3a764000060005b8351811015610c1257610c08610a7a858381518110610bde57fe5b6020026020010151858481518110610bf257fe5b602002602001015161115890919063ffffffff16565b9150600101610bc3565b5061076d60008211610137611010565b600080610c3984610c338188611022565b90611038565b9050610c526709b6e64a8ec60000821015610132611010565b6000610c70610c69670de0b6b3a7640000896110fe565b839061108f565b90506000610c87610c80836111a0565b8a90610fda565b90506000610c94896111a0565b90506000610ca283836110c2565b90506000610cb08483611022565b9050610ccf610cc8610cc18a6111a0565b8490610fda565b8290611146565b9c9b505050505050505050505050565b60006060845167ffffffffffffffff81118015610cfb57600080fd5b50604051908082528060200260200182016040528015610d25578160200160208202803683370190505b5090506000805b8851811015610dcd57610d6f898281518110610d4457fe5b6020026020010151610c33898481518110610d5b57fe5b60200260200101518c8581518110610a4a57fe5b838281518110610d7b57fe5b602002602001018181525050610dc36109cf898381518110610d9957fe5b6020026020010151858481518110610dad57fe5b60200260200101516110c290919063ffffffff16565b9150600101610d2c565b50670de0b6b3a764000060005b8951811015610ea3576000848281518110610df157fe5b6020026020010151841115610e43576000610e0e610a2a866111a0565b90506000610e22828c8681518110610a4a57fe5b9050610e3a6109cf610e338b6111a0565b8390611038565b92505050610e5a565b888281518110610e4f57fe5b602002602001015190505b6000610e838c8481518110610e6b57fe5b602002602001015161098b848f8781518110610a4a57fe5b9050610e97610af58c8581518110610ade57fe5b93505050600101610dda565b50610eb7610eb0826111a0565b87906110c2565b9998505050505050505050565b600080610ed584610c338188611146565b9050610eee6729a2241af62c0000821115610133611010565b6000610f05610c69670de0b6b3a764000089611038565b90506000610f25610f1e83670de0b6b3a7640000611022565b8a906110c2565b90506000610f32896111a0565b90506000610f4083836110c2565b90506000610f4e8483611022565b9050610ccf610cc8610f5f8a6111a0565b8490611038565b6000838311610f7757506000610722565b6000610f838585611038565b90506000610f99670de0b6b3a7640000886110fe565b9050610fad826709b6e64a8ec600006111cc565b91506000610fbb838361108f565b90506000610fd2610fcb836111a0565b8b90610fda565b905061082581875b6000828202610ffe841580610ff7575083858381610ff457fe5b04145b6003611010565b670de0b6b3a764000090049392505050565b8161101e5761101e816111e3565b5050565b6000611032838311156001611010565b50900390565b60006110478215156004611010565b826110545750600061076d565b670de0b6b3a7640000838102906110779085838161106e57fe5b04146005611010565b82600182038161108357fe5b0460010191505061076d565b60008061109c8484611236565b905060006110b66110af836127106110c2565b6001611146565b90506107228282611146565b60008282026110dc841580610ff7575083858381610ff457fe5b806110eb57600091505061076d565b670de0b6b3a76400006000198201611083565b600061110d8215156004611010565b8261111a5750600061076d565b670de0b6b3a7640000838102906111349085838161106e57fe5b82818161113d57fe5b0491505061076d565b600082820161076a8482101583611010565b6000806111658484611236565b905060006111786110af836127106110c2565b90508082101561118d5760009250505061076d565b6111978282611022565b9250505061076d565b6000670de0b6b3a764000082106111b85760006111c4565b81670de0b6b3a7640000035b90505b919050565b6000818310156111dc578161076a565b5090919050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b60008161124c5750670de0b6b3a764000061076d565b826112595750600061076d565b61126a600160ff1b84106006611010565b82611290770bce5086492111aea88f4bb1ca6bcf584181ea8059f7653284106007611010565b826000670c7d713b49da0000831380156112b15750670f43fc2c04ee000083125b156112e85760006112c184611341565b9050670de0b6b3a764000080820784020583670de0b6b3a7640000830502019150506112f6565b816112f28461145f565b0290505b670de0b6b3a7640000900561132e680238fd42c5cf03ffff198212801590611327575068070c1cc73b00c800008213155b6008611010565b611337816117f8565b9695505050505050565b670de0b6b3a7640000026000806a0c097ce7bc90715b34b9f160241b808401906ec097ce7bc90715b34b9f0fffffffff198501028161137c57fe5b05905060006a0c097ce7bc90715b34b9f160241b82800205905081806a0c097ce7bc90715b34b9f160241b81840205915060038205016a0c097ce7bc90715b34b9f160241b82840205915060058205016a0c097ce7bc90715b34b9f160241b82840205915060078205016a0c097ce7bc90715b34b9f160241b82840205915060098205016a0c097ce7bc90715b34b9f160241b828402059150600b8205016a0c097ce7bc90715b34b9f160241b828402059150600d8205016a0c097ce7bc90715b34b9f160241b828402059150600f826002919005919091010295945050505050565b6000670de0b6b3a764000082121561149b57611491826a0c097ce7bc90715b34b9f160241b8161148b57fe5b0561145f565b60000390506111c7565b6000775803bcc5cb9634ba4cfb2213f784019318ed4dcb6017880f60361b83126114e65772195e54c5dd42177f53a27172fa9ec63026282760241b830592506806f05b59d3b2000000015b73011798004d755d3c8bc8e03204cf44619e000000831261151e576b1425982cf597cd205cef7380830592506803782dace9d9000000015b606492830292026e01855144814a7ff805980ff00840008312611566576e01855144814a7ff805980ff008400068056bc75e2d63100000840205925068ad78ebc5ac62000000015b6b02df0ab5a80a22c61ab5a70083126115a1576b02df0ab5a80a22c61ab5a70068056bc75e2d6310000084020592506856bc75e2d631000000015b693f1fce3da636ea5cf85083126115d857693f1fce3da636ea5cf85068056bc75e2d631000008402059250682b5e3af16b18800000015b690127fa27722cc06cc5e2831261160f57690127fa27722cc06cc5e268056bc75e2d6310000084020592506815af1d78b58c400000015b68280e60114edb805d0383126116445768280e60114edb805d0368056bc75e2d631000008402059250680ad78ebc5ac6200000015b680ebc5fb41746121110831261166f57680ebc5fb4174612111068056bc75e2d631000009384020592015b6808f00f760a4b2db55d83126116a4576808f00f760a4b2db55d68056bc75e2d6310000084020592506802b5e3af16b1880000015b6806f5f177578893793783126116d9576806f5f177578893793768056bc75e2d63100000840205925068015af1d78b58c40000015b6806248f33704b286603831261170d576806248f33704b28660368056bc75e2d63100000840205925067ad78ebc5ac620000015b6805c548670b9510e7ac8312611741576805c548670b9510e7ac68056bc75e2d6310000084020592506756bc75e2d6310000015b600068056bc75e2d63100000840168056bc75e2d63100000808603028161176457fe5b059050600068056bc75e2d63100000828002059050818068056bc75e2d63100000818402059150600382050168056bc75e2d63100000828402059150600582050168056bc75e2d63100000828402059150600782050168056bc75e2d63100000828402059150600982050168056bc75e2d63100000828402059150600b820501600202606485820105979650505050505050565b6000611827680238fd42c5cf03ffff198312158015611820575068070c1cc73b00c800008313155b6009611010565b600082121561185a5761183c826000036117f8565b6a0c097ce7bc90715b34b9f160241b8161185257fe5b0590506111c7565b60006806f05b59d3b2000000831261189857506806f05b59d3b1ffffff199091019072195e54c5dd42177f53a27172fa9ec63026282760241b6118ce565b6803782dace9d900000083126118ca57506803782dace9d8ffffff19909101906b1425982cf597cd205cef73806118ce565b5060015b6064929092029168056bc75e2d6310000068ad78ebc5ac62000000841261191e5768ad78ebc5ac61ffffff199093019268056bc75e2d631000006e01855144814a7ff805980ff008400082020590505b6856bc75e2d631000000841261195a576856bc75e2d630ffffff199093019268056bc75e2d631000006b02df0ab5a80a22c61ab5a70082020590505b682b5e3af16b18800000841261199457682b5e3af16b187fffff199093019268056bc75e2d63100000693f1fce3da636ea5cf85082020590505b6815af1d78b58c40000084126119ce576815af1d78b58c3fffff199093019268056bc75e2d63100000690127fa27722cc06cc5e282020590505b680ad78ebc5ac62000008412611a0757680ad78ebc5ac61fffff199093019268056bc75e2d6310000068280e60114edb805d0382020590505b68056bc75e2d631000008412611a405768056bc75e2d630fffff199093019268056bc75e2d63100000680ebc5fb4174612111082020590505b6802b5e3af16b18800008412611a79576802b5e3af16b187ffff199093019268056bc75e2d631000006808f00f760a4b2db55d82020590505b68015af1d78b58c400008412611ab25768015af1d78b58c3ffff199093019268056bc75e2d631000006806f5f177578893793782020590505b68056bc75e2d631000008481019085906002908280020505918201919050600368056bc75e2d631000008783020505918201919050600468056bc75e2d631000008783020505918201919050600568056bc75e2d631000008783020505918201919050600668056bc75e2d631000008783020505918201919050600768056bc75e2d631000008783020505918201919050600868056bc75e2d631000008783020505918201919050600968056bc75e2d631000008783020505918201919050600a68056bc75e2d631000008783020505918201919050600b68056bc75e2d631000008783020505918201919050600c68056bc75e2d631000008783020505918201919050606468056bc75e2d6310000084840205850205969550505050505056fea2646970667358221220ad4812e445aca09a36312146ec671b8864518bd0aed4859af55767d4578e452e64736f6c63430007030033";

export class MockWeightedMath__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockWeightedMath> {
    return super.deploy(overrides || {}) as Promise<MockWeightedMath>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockWeightedMath {
    return super.attach(address) as MockWeightedMath;
  }
  connect(signer: Signer): MockWeightedMath__factory {
    return super.connect(signer) as MockWeightedMath__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockWeightedMathInterface {
    return new utils.Interface(_abi) as MockWeightedMathInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockWeightedMath {
    return new Contract(address, _abi, signerOrProvider) as MockWeightedMath;
  }
}
