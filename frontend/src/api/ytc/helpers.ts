import { BigNumber, BigNumberish, Contract, ethers, Signer } from "ethers";
import YieldTokenCompounding from "@/artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json";
import ITranche from "@/artifacts/contracts/element-finance/ITranche.sol/ITranche.json";
import { ITranche as ITrancheType } from "@/hardhat/typechain/ITranche";
import ERC20 from "@/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json";
import { ERC20 as ERC20Type } from "@/hardhat/typechain/ERC20";
import { ElementAddresses, Tranche } from "@/types/manual/types";
import { getRemainingTrancheYears, getTrancheByAddress } from "@/api/element";
import { getTokenPrice } from "@/api/prices";
import { getUnderlyingTotal } from "@/api/element/wrappedPositionAmount";
import { getPrincipalTotal } from "@/api/element/principalTotal";
import { getYieldTotal } from "@/api/element/yieldTotal";
import { calculateYtcReturn } from "@/api/ytc/calculate";
import Decimal from "decimal.js";

export interface YTCInput {
  baseTokenAddress: string;
  numberOfCompounds: number;
  trancheAddress: string;
  amountCollateralDeposited: BigNumberish;
  ytcContractAddress: string;
  variableApy?: number;
  baseTokenPrice?: number;
}

export interface YTCGain {
  estimatedRedemption: number;
  netGain: number;
  roi: number;
  apr: number;
}

export interface YTCOutput {
  receivedTokens: {
    yt: {
      name: string;
      amount: number;
    };
    baseTokens: {
      name: string;
      amount: number;
    };
  };
  spentTokens: {
    baseTokens: {
      name: string;
      amount: number;
    };
  };
  gas: {
    eth: number;
    baseToken: number;
  };
  tranche: {
    expiration: number;
  };
  inputs: YTCInput;
  gain?: YTCGain;
}

export interface YTCParameters {
  ytc: Contract;
  trancheAddress: string;
  balancerPoolId: string;
  yieldTokenDecimals: number;
  baseTokenDecimals: number;
  trancheExpiration: number;
  baseTokenName: string;
  baseTokenAmountAbsolute: BigNumber;
  ytSymbol: string;
  ytAddress: string;
  ethToBaseTokenRate: number;
  simulate: (n: number) => Promise<[BigNumber, BigNumber]>;
}

// helper function to retrieve parameters required for running the YTC transaction
// param userData, the user selections for simulation or execution, includes the baseToken, number of compounds, tranche, amount of collateral
// param elementAddresses, constant containing the deployment addresses of tokens vaults and pools
// param signer, the signer of the transaction
// Returns, YTC parameters, a ytc contract instance, the balancer pool, decimals for tokens, the name of the yield token ...etc
export const getYTCParameters = async (
  userData: YTCInput,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<YTCParameters> => {
  const ytcAbi = YieldTokenCompounding.abi;
  const erc20Abi = ERC20.abi;
  const trancheAbi = ITranche.abi;

  // Get data
  const baseTokenName = getTokenNameByAddress(
    userData.baseTokenAddress,
    elementAddresses.tokens
  );
  if (!baseTokenName) {
    throw new Error("Could not find base token name");
  }

  const yieldTokenCompoundingAddress = userData.ytcContractAddress;
  const baseTokenAddress: string = userData.baseTokenAddress;

  // Get specific tranche
  const trancheDetails: Tranche | undefined = getTrancheByAddress(
    userData.trancheAddress,
    elementAddresses.tranches[baseTokenName]
  );
  if (!trancheDetails) {
    throw new Error("Could not find tranche");
  }

  // if it is expired throw an error
  if (!isTrancheActive(trancheDetails)) {
    throw new Error("Tranche is expired");
  }

  const trancheAddress = trancheDetails.address;
  const balancerPoolId = trancheDetails.ptPool.poolId;
  const balancerPoolAddress = trancheDetails.ptPool.address;
  const timeStretch = trancheDetails.ptPool.timeStretch;

  // Load contracts
  const ytc = new ethers.Contract(
    yieldTokenCompoundingAddress,
    ytcAbi,
    signerOrProvider
  );
  const tranche: ITrancheType = new ethers.Contract(
    trancheAddress,
    trancheAbi,
    signerOrProvider
  ) as ITrancheType;
  const trancheExpiration = trancheDetails.expiration;
  const yieldTokenAddress = await tranche.interestToken();
  const yieldToken: ERC20Type = new ethers.Contract(
    yieldTokenAddress,
    erc20Abi,
    signerOrProvider
  ) as ERC20Type;
  const ytSymbol = await yieldToken.symbol();
  const yieldTokenDecimals = ethers.BigNumber.from(
    await yieldToken.decimals()
  ).toNumber();
  const baseToken: ERC20Type = new ethers.Contract(
    baseTokenAddress,
    erc20Abi,
    signerOrProvider
  ) as ERC20Type;
  const baseTokenDecimals = ethers.BigNumber.from(
    await baseToken.decimals()
  ).toNumber();

  const amountCollateralDespositedAbsolute = ethers.utils.parseUnits(
    userData.amountCollateralDeposited.toString(),
    baseTokenDecimals
  );

  // if the suggested amount is greater than the total amount, return the total amount instead
  let amount: BigNumber;
  if (signerOrProvider instanceof Signer){
    const userCollateralBalance = await baseToken.balanceOf(await signerOrProvider.getAddress())
    if (userCollateralBalance.lt(amountCollateralDespositedAbsolute)){
      amount = userCollateralBalance;
    } else {
      amount = amountCollateralDespositedAbsolute;
    }
  } else {
    amount = amountCollateralDespositedAbsolute;
  }

  const ethToBaseToken = await ethToBaseTokenRate(
    baseTokenName,
    elementAddresses,
    signerOrProvider
  );

  let simulate;
    simulate = async (n: number) => {
      return await calculateYtcReturn(
        n,
        new Decimal(amount.toString()),
        userData.baseTokenAddress,
        trancheAddress,
        timeStretch,
        trancheExpiration,
        balancerPoolAddress,
        elementAddresses,
        signerOrProvider
      )
  }

  return {
    ytc,
    trancheAddress,
    trancheExpiration,
    balancerPoolId,
    yieldTokenDecimals,
    baseTokenDecimals,
    baseTokenName,
    baseTokenAmountAbsolute: amount,
    ytSymbol,
    ytAddress: yieldTokenAddress,
    ethToBaseTokenRate: ethToBaseToken,
    simulate,
  };
};

// Calculates the expected gains from a yield token compound simulation
// param speculatedVariableRate
export const calculateGain = (
  ytExposure: number,
  speculatedVariableRate: number = 0,
  trancheExpiration: number,
  baseTokensSpent: number,
  estimatedBaseTokensGas: number,
  yieldTokenAccruedValue: number
): YTCGain => {
  const termRemainingYears = getRemainingTrancheYears(trancheExpiration);

  // speculated variable rate is an apy, but we need this as an apr
  const returnPercentage = speculatedVariableRate * termRemainingYears;

  const returnedTokens =
    (returnPercentage / 100 + yieldTokenAccruedValue) * ytExposure;

  const netGain = returnedTokens - baseTokensSpent - estimatedBaseTokensGas;
  const roi = netGain / baseTokensSpent;
  const apr = roi * (1 / termRemainingYears);

  // Change X% from X/100 to X
  return {
    estimatedRedemption: returnedTokens,
    netGain: netGain,
    roi: roi * 100,
    apr: apr * 100,
  };
};

export const yieldTokenAccruedValue = async (
  trancheAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider
): Promise<number> => {
  const wrappedPositionTotal = await getUnderlyingTotal(
    trancheAddress,
    signerOrProvider
  );

  const principalTotal = await getPrincipalTotal(
    trancheAddress,
    signerOrProvider
  );

  const yieldTotal = await getYieldTotal(
    trancheAddress,
    signerOrProvider
  );

  const accruedValue = (wrappedPositionTotal - principalTotal) / yieldTotal;


  // if the value is lower than 0.001% we'll show zero
  if (Math.abs(accruedValue) < 0.00001){
    return 0;
  }

  return accruedValue
};

export const isTrancheActive = (tranche: Tranche): boolean => {
  const time = new Date().getTime();
  // expiration is in seconds normally
  const expirationInMs = tranche.expiration * 1000;

  return time <= expirationInMs;
};

export const getTokenNameByAddress = (
  address: string,
  tokens: { [name: string]: string }
): string | undefined => {
  const result = Object.entries(tokens).find(
    ([key, value]) => value === address
  );

  return result && result[0];
};

const ethToBaseTokenRate = async (
  baseTokenName: string,
  elementAddresses: ElementAddresses,
  signerOrProvider: Signer | ethers.providers.Provider
) => {
  const baseTokenPrice = await getTokenPrice(
    baseTokenName,
    elementAddresses,
    signerOrProvider
  );
  const ethPrice = await getTokenPrice(
    "eth",
    elementAddresses,
    signerOrProvider
  );

  return ethPrice / baseTokenPrice;
};
