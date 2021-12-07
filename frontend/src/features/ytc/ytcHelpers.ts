import { BigNumber, BigNumberish, Contract, ethers, Signer } from "ethers";
import YieldTokenCompounding from '../../artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json'
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json'
import {ITranche as ITrancheType} from '../../hardhat/typechain/ITranche';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'
import {ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { getRemainingTrancheYears, getTrancheByAddress } from "../element";
import { getTokenPrice } from "../prices";
import { getUnderlyingTotal } from "../element/wrappedPositionAmount";
import { getPrincipalTotal } from "../element/principalTotal";
import { getYieldTotal } from "../element/yieldTotal";
import { deployments } from "../../constants/apy-mainnet-constants";
import YTCZap from "../../artifacts/contracts/YTCZap.sol/YTCZap.json";
import { getCurveSwapAddress, isCurveToken } from "../prices/curve";
import { getZapInData } from "../zapper/getTransactionData";
import { parseEther } from "ethers/lib/utils";
const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const BURN_ADDRESS = "0x000000000000000000000000000000000000dead";

export interface YTCInput {
    baseTokenAddress: string;
    numberOfCompounds: number,
    trancheAddress: string;
    amountCollateralDeposited: BigNumberish,
    ytcContractAddress: string;
    variableApy?: number;
    baseTokenPrice?: number;
}

export interface YTCGain {
    estimatedRedemption: number;
    netGain: number,
    roi: number,
    apr: number,
}

export interface YTCOutput {
    receivedTokens: {
        yt: {
            name: string,
            amount: number,
        }
        baseTokens: {
            name: string,
            amount: number,
        }
    },
    spentTokens: {
        baseTokens: {
            name: string,
            amount: number
        }
    },
    gas: {
        eth: number,
        baseToken: number,
    },
    tranche: {
        expiration: number,
    },
    inputs: YTCInput,
    gain?: YTCGain
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
    simulate: (n: number) => Promise<any[]>;
}

// helper function to retrieve parameters required for running the YTC transaction
// param userData, the user selections for simulation or execution, includes the baseToken, number of compounds, tranche, amount of collateral
// param elementAddresses, constant containing the deployment addresses of tokens vaults and pools
// param signer, the signer of the transaction
// Returns, YTC parameters, a ytc contract instance, the balancer pool, decimals for tokens, the name of the yield token ...etc
export const getYTCParameters = async (userData: YTCInput, elementAddresses: ElementAddresses, signerOrProvider: Signer | ethers.providers.Provider): Promise<YTCParameters> => {
    const ytcAbi = YieldTokenCompounding.abi;
    const erc20Abi = ERC20.abi;
    const trancheAbi = ITranche.abi;

    // Get data
    const baseTokenName = getTokenNameByAddress(userData.baseTokenAddress, elementAddresses.tokens);
    if (!baseTokenName){
        throw new Error("Could not find base token name");
    }

    const yieldTokenCompoundingAddress = userData.ytcContractAddress;
    const baseTokenAddress: string = userData.baseTokenAddress;

    // Get specific tranche
    const trancheDetails: Tranche | undefined = getTrancheByAddress(userData.trancheAddress, elementAddresses.tranches[baseTokenName]);
    if (!trancheDetails){
        throw new Error("Could not find tranche");
    }

    // if it is expired throw an error
    if (!isTrancheActive(trancheDetails)){
        throw new Error("Tranche is expired");
    }

    const trancheAddress = trancheDetails.address;
    const balancerPoolId = trancheDetails.ptPool.poolId;    
    
    // Load contracts
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signerOrProvider);
    const tranche: ITrancheType = (new ethers.Contract(trancheAddress, trancheAbi, signerOrProvider)) as ITrancheType;
    const trancheExpiration = trancheDetails.expiration;
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken: ERC20Type = (new ethers.Contract(yieldTokenAddress, erc20Abi, signerOrProvider)) as ERC20Type;
    const ytSymbol = await yieldToken.symbol();
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken: ERC20Type = new ethers.Contract(baseTokenAddress, erc20Abi, signerOrProvider) as ERC20Type;
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    const amountCollateralDespositedAbsolute = ethers.utils.parseUnits(userData.amountCollateralDeposited.toString(), baseTokenDecimals);


    // if the suggested amount is greater than the total amount, return the total amount instead
    let amount = amountCollateralDespositedAbsolute;

    const ethToBaseToken = await ethToBaseTokenRate(baseTokenName, elementAddresses, signerOrProvider);


    // get teh amount of collateral denominated in eth
    const amountInEthNormalized = parseFloat(userData.amountCollateralDeposited.toString()) / ethToBaseToken;
    // convert it to the absolute non-decimal value
    const amountInEthAbsolute = parseEther(amountInEthNormalized.toString())
    // multiply it by two to allow for slippage
    const amountInEthAbsoulteTimes2 = amountInEthAbsolute.mul(2);

    const zapAddress = deployments.YTCZap;
    const ytcAddress = deployments.YieldTokenCompounding;
    const uniswapAddress = deployments.UniswapRouter;

    const ytcZap = new Contract(zapAddress, YTCZap.abi, signerOrProvider);

    let simulate;
    if (isCurveToken(baseTokenName)){
        const poolAddress = await getCurveSwapAddress(userData.baseTokenAddress, signerOrProvider);

        const zapResponse = await getZapInData({
            ownerAddress: ytc.address,
            sellToken: ZERO_ADDRESS,
            poolAddress,
            sellAmount: amountInEthAbsoulteTimes2,
            protocol: "curve",
        })

        simulate = async (n: number) => { return await ytcZap.callStatic.compoundZapper(ytcAddress, n, trancheAddress, balancerPoolId, amount, "0", MAX_UINT_HEX, userData.baseTokenAddress, yieldTokenAddress, zapResponse.data, zapResponse.to, ({from: BURN_ADDRESS, value: amountInEthAbsoulteTimes2}))};
    } else {
        simulate = async (n: number) => { return await ytcZap.callStatic.compoundUniswap(ytcAddress, n, trancheAddress, balancerPoolId, amount, "0", MAX_UINT_HEX, userData.baseTokenAddress, yieldTokenAddress, MAX_UINT_HEX, uniswapAddress, ({from: BURN_ADDRESS, value: amountInEthAbsoulteTimes2}))};
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
        simulate
    }
}

// Calculates the expected gains from a yield token compound simulation
// param speculatedVariableRate
export const calculateGain = (ytExposure: number, speculatedVariableRate: number = 0, trancheExpiration: number, baseTokensSpent: number, estimatedBaseTokensGas: number, yieldTokenAccruedValue: number): YTCGain => {
    const termRemainingYears = getRemainingTrancheYears(trancheExpiration);


    // speculated variable rate is an apy, but we need this as an apr
    const returnPercentage = speculatedVariableRate*termRemainingYears;

    const returnedTokens = (returnPercentage/100 + yieldTokenAccruedValue) * ytExposure;


    const netGain = (returnedTokens) - baseTokensSpent - estimatedBaseTokensGas;
    const roi = (netGain / baseTokensSpent);
    const apr = (roi)*(1/termRemainingYears);

    // Change X% from X/100 to X
    return {
        estimatedRedemption: returnedTokens,
        netGain: netGain,
        roi: roi * 100,
        apr: apr * 100
    }
}

export const yieldTokenAccruedValue = async (elementAddresses: ElementAddresses, trancheAddress: string, signerOrProvider: Signer | ethers.providers.Provider): Promise<number> => {
    const wrappedPositionTotal = await getUnderlyingTotal(elementAddresses, trancheAddress, signerOrProvider);

    const principalTotal = await  getPrincipalTotal(elementAddresses, trancheAddress, signerOrProvider);

    const yieldTotal = await getYieldTotal(elementAddresses, trancheAddress, signerOrProvider);

    return (wrappedPositionTotal - principalTotal) / yieldTotal;
}

export const isTrancheActive = (tranche: Tranche): boolean => {
    const time = new Date().getTime();
    // expiration is in seconds normally
    const expirationInMs = tranche.expiration * 1000

    return time <= expirationInMs;
}

export const getTokenNameByAddress = (address: string, tokens: {[name: string]: string}): string | undefined => {
    const result = Object.entries(tokens).find(([key, value]) => (
        value === address
    ))

    return result && result[0]
}

const ethToBaseTokenRate = async (baseTokenName: string, elementAddresses: ElementAddresses, signerOrProvider: Signer | ethers.providers.Provider) => {
    const baseTokenPrice = await getTokenPrice(baseTokenName, elementAddresses, signerOrProvider);
    const ethPrice =  await getTokenPrice("eth", elementAddresses, signerOrProvider);

    return (ethPrice/baseTokenPrice);

}
