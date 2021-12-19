import hre from 'hardhat';
import {createObjectCsvWriter} from 'csv-writer';
import mainnetConstants from '../constants/mainnet-constants.json';
import { ElementAddresses } from '../frontend/src/types/manual/types';
import { calculateGain, yieldTokenAccruedValue, YTCGain, YTCInput, YTCOutput } from '../frontend/src/api/ytc/helpers';
import { getTokenPrice } from '../frontend/src/api/prices';
import { getActiveTranches } from '../frontend/src/api/element';
import { deployments } from '../frontend/src/constants/apy-mainnet-constants';
import { simulateYTCForCompoundRange } from '../frontend/src/api/ytc/simulate';
import { getVariableAPY } from '../frontend/src/api/prices/yearn';

interface TrancheResult {
    address: string;
    expiry: string;
    output: YTCGain[];
}

interface TokenResult {
    name: string;
    address: string;
    output: any;
}

const start = async (amount: number) => {
    const constants: ElementAddresses = mainnetConstants;

    const tokens = constants.tokens;

    const provider = hre.ethers.provider;

    const tokensPromise: Promise<TokenResult>[] = Object.entries(tokens).map(async ([key, value], tokenIndex) => {

        const baseTokenPrice = await getTokenPrice(key, constants, provider);

        const baseTokenAmount = amount/baseTokenPrice;

        const tranches = await getActiveTranches(value, constants);

        const tranchePromise: Promise<TrancheResult>[] = tranches.map(async (tranche, trancheIndex) => {

            const userData: YTCInput = {
                baseTokenAddress: value,
                numberOfCompounds: 1,
                trancheAddress: tranche.address,
                ytcContractAddress: deployments.YieldTokenCompounding,
                amountCollateralDeposited: baseTokenAmount.toFixed(4),
            }

            console.log('Getting results for tranche', tranche.address);

            const compoundRange = await simulateYTCForCompoundRange(userData, constants, [1,29], provider)

            const accruedValue = await yieldTokenAccruedValue(tranche.address, provider);
            const variableRate = await getVariableAPY(tranche.address, provider);


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

    return fulfilledResults;
}


const logResults = (results: TokenResult[], amount: string) => {
    const data: any[] = [];

    results.map((tokenResult: TokenResult) => {
        tokenResult.output.map((trancheResult: TrancheResult) => {
            trancheResult.output.map((compoundResult: YTCGain) => {
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

    const date = new Date(Date.now()).toDateString();

    const csvWriter = createObjectCsvWriter({
        path: `top-opportunities/ytc-${date}-${amount}.csv`,
        header: [
            {
                id: 'tokenName',
                title: 'Token Name'
            },
            {
                id: 'tokenAddress',
                title: 'Token Address'
            },
            {
                id: 'compounds',
                title: 'Number Compounds'
            },
            {
                id: 'trancheAddress',
                title: 'Tranche Address'
            },
            {
                id: 'expiry',
                title: 'Expiry'
            },
            {
                id: 'netGain',
                title: 'Net Gain'
            },
            {
                id: 'roi',
                title: 'ROI'
            },
            {
                id: 'apr',
                title: 'APR'
            },
            {
                id: 'spent',
                title: 'Tokens Spent'
            }
        ]
    })

    csvWriter.writeRecords(data);
    
}

[10000, 50000, 100000, 500000, 1000000].map((number) => {
    start(number).then((results) => {
        logResults(results, number.toString());
    })
})

const isFilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';
const isRejected = (v: PromiseSettledResult<any>): v is PromiseRejectedResult => v.status === 'rejected';
