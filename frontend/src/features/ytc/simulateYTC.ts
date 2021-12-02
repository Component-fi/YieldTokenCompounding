import { BigNumber, ethers, Signer } from "ethers";
import { Provider } from '@ethersproject/providers';
import _ from "lodash";
import { GAS_LIMITS } from "../../constants/gasLimits";
import { ElementAddresses } from "../../types/manual/types";
import { getYTCParameters, YTCInput, YTCOutput, YTCParameters } from "./ytcHelpers";

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const LACK_OF_LIQUIDITY_MESSAGE = "Error: VM Exception while processing transaction: reverted with reason string 'BAL#001'";

interface JsonErrorType extends Error {
    code: -32603;
    message: "Internal JSON-RPC error.";
    data: {
        code: number,
        message: string,
    };
}
const isJsonErrorType = (error: any): error is JsonErrorType => {
    return (error as JsonErrorType).code === -32603;
}

// Simulates a single yield token compounding execution to determine what the output would be
// No actual transaction is executed
// param YTC Parameters, derived params required to execute the transaction, a ytc contract instance, the balancer pool, decimals for tokens, the name of the yield token etc.
// param userData, user input data for simulating the transaction
// param signer, Signer of the transaction
// returns YTCOutput, contains both input data, and the results fo the simulation, including yield exposure, gas fees, tokens spent, remaining tokens etc.
export const simulateYTC = async ({ytc, trancheAddress, trancheExpiration, balancerPoolId, yieldTokenDecimals, baseTokenDecimals, baseTokenName, ytSymbol: ytName, baseTokenAmountAbsolute, ethToBaseTokenRate}: YTCParameters, userData: YTCInput, signer: Signer): Promise<YTCOutput> => {
    try{
        // Call the method statically to calculate the estimated return
        // The last two arguments are to prevent slippage, but this isn't required as it is a simulation and cannot be frontrun
        var returnedVals = await ytc.callStatic.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, "0", MAX_UINT_HEX);
    } catch (error) {
        // if this is a json rpc error type
        if (isJsonErrorType(error)){
            const reason = error.data.message;

            // Assign a natural language reason for this on chain error
            if (reason === LACK_OF_LIQUIDITY_MESSAGE){
                throw new Error("Insufficient liquidity: Principal Pool")
            }
        } else {
            throw error
        }
    }

    // Estimate the required amount of gas, this is likely very imprecise
    // const gasAmountEstimate = await ytc.estimateGas.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, "0");
    // TODO this is using the mean of hardcoded gas estimations
    const gasAmountEstimate = BigNumber.from(GAS_LIMITS[userData.numberOfCompounds])

    try {
        var ethGasFees = await gasLimitToEthGasFee(signer, gasAmountEstimate);
    } catch (error){
        throw new Error("Could not calculate Gas Fees")
    }

    const gasFeesInBaseToken = ethToBaseTokenRate * ethGasFees;

    // Convert the result to a number
    const [ytExposureAbsolute, baseTokensSpentAbsolute]: BigNumber[] = returnedVals.map((val: any) => ethers.BigNumber.from(val));


    const remainingTokensAbsolute = BigNumber.from(baseTokenAmountAbsolute).sub(BigNumber.from(baseTokensSpentAbsolute));

    const ytExposureNormalized = parseFloat(ethers.utils.formatUnits(ytExposureAbsolute, yieldTokenDecimals))
    const remainingTokensNormalized = parseFloat(ethers.utils.formatUnits(remainingTokensAbsolute, baseTokenDecimals))
    const baseTokensSpentNormalized = parseFloat(ethers.utils.formatUnits(baseTokensSpentAbsolute, baseTokenDecimals))

    return {
        receivedTokens: {
            yt: {
                name: ytName,
                amount: ytExposureNormalized,
            },
            baseTokens: {
                name: baseTokenName,
                amount: remainingTokensNormalized
            }
        },
        spentTokens: {
            baseTokens: {
                name: baseTokenName,
                amount: baseTokensSpentNormalized
            }
        },
        gas: {
            eth: ethGasFees,
            baseToken: gasFeesInBaseToken,
        },
        tranche: {
            expiration: trancheExpiration,
        },
        inputs: userData,
    }
}

export const simulateYTCZap = async ({ytc, ytAddress, trancheAddress, trancheExpiration, balancerPoolId, yieldTokenDecimals, baseTokenDecimals, baseTokenName, ytSymbol: ytName, baseTokenAmountAbsolute, ethToBaseTokenRate, simulate}: YTCParameters, userData: YTCInput,  signerOrProvider: Signer | Provider): Promise<YTCOutput> => {

    const returnedVals = await simulate(userData.numberOfCompounds);
    // Estimate the required amount of gas, this is likely very imprecise
    // const gasAmountEstimate = await ytc.estimateGas.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, "0");
    // TODO this is using the mean of hardcoded gas estimations
    const gasAmountEstimate = BigNumber.from(GAS_LIMITS[userData.numberOfCompounds])

    const ethGasFees = await gasLimitToEthGasFee(signerOrProvider, gasAmountEstimate);

    const gasFeesInBaseToken = ethToBaseTokenRate * ethGasFees;

    // Convert the result to a number
    const [ytExposureAbsolute, baseTokensSpentAbsolute]: BigNumber[] = returnedVals.map((val: any) => ethers.BigNumber.from(val));


    const remainingTokensAbsolute = BigNumber.from(baseTokenAmountAbsolute).sub(BigNumber.from(baseTokensSpentAbsolute));

    const ytExposureNormalized = parseFloat(ethers.utils.formatUnits(ytExposureAbsolute, yieldTokenDecimals))
    const remainingTokensNormalized = parseFloat(ethers.utils.formatUnits(remainingTokensAbsolute, baseTokenDecimals))
    const baseTokensSpentNormalized = parseFloat(ethers.utils.formatUnits(baseTokensSpentAbsolute, baseTokenDecimals))

    return {
        receivedTokens: {
            yt: {
                name: ytName,
                amount: ytExposureNormalized,
            },
            baseTokens: {
                name: baseTokenName,
                amount: remainingTokensNormalized
            }
        },
        spentTokens: {
            baseTokens: {
                name: baseTokenName,
                amount: baseTokensSpentNormalized
            }
        },
        gas: {
            eth: ethGasFees,
            baseToken: gasFeesInBaseToken,
        },
        tranche: {
            expiration: trancheExpiration,
        },
        inputs: userData,
    }
}

// Runs the simulateYTC method for a range of compounds, rather than just one
// param userData, user input data for simulating the transaction
// param elementAddresses, constant containing the deployment addresses of tokens vaults and pools
// param compound Range, the lowest, and largest number of compounds for the simulation to execute
// param signer, Signer of the transaction
// Returns YTCOutput[], an array of yield token compounding outputs
export const simulateYTCForCompoundRange = async (userData: YTCInput, constants: ElementAddresses, compoundRange: [number, number], signerOrProvider: Signer | ethers.providers.Provider): Promise<YTCOutput[]> => {

    const yieldCalculationParameters = await getYTCParameters(userData, constants, signerOrProvider);

    const promises =  _.range(compoundRange[0], compoundRange[1] + 1).map((index) => {
        const data: YTCInput = { 
            ...userData,
            numberOfCompounds: index
        }

        return simulateYTCZap(
            yieldCalculationParameters,
            data,
            signerOrProvider
        )
    })

    const results = await Promise.allSettled(promises)

    const fulfilledResults = results.filter(isFilled).map((result: PromiseFulfilledResult<YTCOutput>) => {
        return result.value;
    })

    const errors: Error[] = results.filter(isRejected).map((result: PromiseRejectedResult) => (result.reason));

    if (fulfilledResults.length === 0){
        if (errors.length > 0){
            console.log(errors[0]);
            throw new Error(errors[0].message)
        }
    }
    return fulfilledResults;
}

// Takes the current discount price of a pt and the desired percentage exposure to Y tokens
// This returns the number of compounds required to get that exposure
// If the number of compounds is between 0-2, it will return 2, and if it is larger than 29 it will return 29
// This is because the simulator can only support simulations between 1-30, and the simulator will execute additional ytcs for the nearest whole numbers
// Ex. if the compounds returned is 5, the 4,5 and 6 compounds will be simulated
export const getCompoundsFromTargetExposure = (fixedRate: number, targetExposure: number, daysRemaining: number): number => {

    const yearsRemaining = daysRemaining/365;
    const spotPrice = 1 - (fixedRate * yearsRemaining);

    const bottomLog = Math.log(spotPrice);
    const topLog = Math.log(1-(targetExposure/100))
    const estimatedCompounds = Math.floor(topLog/bottomLog);

    if (estimatedCompounds <= 29 && estimatedCompounds >= 2){
        return estimatedCompounds;
    } else if (estimatedCompounds < 2) {
        return 2;
    } else {
        return 29;
    }
}

//eslint-disable-next-line
const gasLimitToEthGasFee = async (signerOrProvider: ethers.Signer | ethers.providers.Provider, gasAmountEstimate: ethers.BigNumber): Promise<number> => {
    const {maxFeePerGas, maxPriorityFeePerGas} = await signerOrProvider.getFeeData();

    if (!maxFeePerGas || !maxPriorityFeePerGas){
        throw Error('Could not get gas fees')
    }

    const gasCostWei: ethers.BigNumber = gasAmountEstimate.mul(maxFeePerGas.add(maxPriorityFeePerGas));

    const gasCostEth: string = ethers.utils.formatEther(gasCostWei);
    
    return parseFloat(gasCostEth);
}


const isFilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';
const isRejected = (v: PromiseSettledResult<any>): v is PromiseRejectedResult => v.status === 'rejected';