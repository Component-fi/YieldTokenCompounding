import { getActiveTranches } from "api/element";
import { getTokenPrice } from "api/prices";
import { getVariableAPY } from "api/prices/yearn";
import { deployments } from "constants/apy-mainnet-constants";
import { providers, Signer } from "ethers";
import { ElementAddresses } from "types/manual/types";
import { calculateGain, yieldTokenAccruedValue, YTCGain, YTCInput, YTCOutput } from "./helpers";
import { simulateYTCForCompoundRange } from "./simulate";

export interface TrancheResult {
    address: string;
    expiry: string;
    output: YTCGain[];
}

export interface TokenResult {
    name: string;
    address: string;
    output: any;
}


export const simulateAllTranches = async (amount: number, signerOrProvider: Signer | providers.Provider , constants: ElementAddresses): Promise<SimulationResult[]> => {

    const tokens = constants.tokens;

    const tokensPromise: Promise<TokenResult>[] = Object.entries(tokens).map(async ([key, value], tokenIndex) => {

        const baseTokenPrice = await getTokenPrice(key, constants, signerOrProvider);

        const baseTokenAmount = amount/baseTokenPrice;

        const tranches = getActiveTranches(value, constants);

        const tranchePromise: Promise<TrancheResult>[] = tranches.map(async (tranche, trancheIndex) => {

            const userData: YTCInput = {
                baseTokenAddress: value,
                numberOfCompounds: 1,
                trancheAddress: tranche.address,
                ytcContractAddress: deployments.YieldTokenCompounding,
                amountCollateralDeposited: baseTokenAmount.toFixed(4),
            }

            console.log('Getting results for tranche', tranche.address);

            const compoundRange = await simulateYTCForCompoundRange(userData, constants, [1,29], signerOrProvider)

            const accruedValue = await yieldTokenAccruedValue(tranche.address, signerOrProvider);
            const variableRate = await getVariableAPY(tranche.address, signerOrProvider);


            const gains = compoundRange.map((output: YTCOutput) => ({
                ...calculateGain(
                    output.receivedTokens.yt.amount,
                    variableRate,
                    tranche.expiration,
                    output.spentTokens.baseTokens.amount,
                    output.gas.baseToken,
                    accruedValue
                ),
                compounds: output.inputs.numberOfCompounds,
                spent: (output.spentTokens.baseTokens.amount + output.gas.baseToken ) * baseTokenPrice
            }))

            
            return {
                address: tranche.address,
                expiry: (new Date(tranche.expiration * 1000)).toDateString(),
                output: gains,
            }
        })

        const results = await Promise.allSettled(tranchePromise);

        const fulfilledResults: TrancheResult[] = results.filter(isFilled).map((result: PromiseFulfilledResult<TrancheResult>) => {
            return result.value;
        })

        const errors: Error[] = results.filter(isRejected).map((result: PromiseRejectedResult) => (result.reason));

        if (tranchePromise.length === 0){
            if (errors.length > 0){
                console.log(errors[0]);
                throw new Error(errors[0].message)
            }
        }

        return {
            name: key,
            address: value,
            output: fulfilledResults
        }
    })


    const results = await Promise.allSettled(tokensPromise);

    const fulfilledResults: TokenResult[] = results.filter(isFilled).map((result: PromiseFulfilledResult<TokenResult>) => {
        return result.value;
    })

    const errors: Error[] = results.filter(isRejected).map((result: PromiseRejectedResult) => (result.reason));

    if (tokensPromise.length === 0){
        if (errors.length > 0){
            console.log(errors[0]);
            throw new Error(errors[0].message)
        }
    }

    return flattenResults(fulfilledResults);
}

export interface SimulationResult extends YTCGain {
    trancheAddress: string;
    expiry: string;
    tokenName: string;
    tokenAddress: string;
}

const flattenResults = (results: TokenResult[]): SimulationResult[] => {
    const data: any[] = [];

    results.forEach((tokenResult: TokenResult) => {
        tokenResult.output.forEach((trancheResult: TrancheResult) => {
            trancheResult.output.forEach((compoundResult: YTCGain) => {
                data.push({
                    ...compoundResult,
                    trancheAddress: trancheResult.address,
                    expiry: trancheResult.expiry,
                    tokenName: tokenResult.name,
                    tokenAddress: tokenResult.address,
                })
            })
        })
    })

    return data;
}

const isFilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';
const isRejected = (v: PromiseSettledResult<any>): v is PromiseRejectedResult => v.status === 'rejected';