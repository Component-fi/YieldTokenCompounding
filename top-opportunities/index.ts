import { deployments } from '../frontend/src/constants/apy-mainnet-constants';
import { simulateYTCForCompoundRange, simulateYTCZap } from '../frontend/src/features/ytc/simulateYTC';
import { calculateGain, YTCInput, YTCOutput, yieldTokenAccruedValue, YTCGain } from '../frontend/src/features/ytc/ytcHelpers';
import mainnetConstants from "../constants/mainnet-constants.json";
import { getActiveTranches } from '../frontend/src/features/element';
import { ElementAddresses, Tranche } from '../frontend/src/types/manual/types';
import hre from 'hardhat';
import { getTokenPrice } from '../frontend/src/features/prices';
import { getVariableAPY } from '../frontend/src/features/prices/yearn';
import {createObjectCsvWriter} from 'csv-writer';
const csvWriter = createObjectCsvWriter({
    path: "out.csv",
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


const AMOUNT = 50000;

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

const start = async () => {
    const constants: ElementAddresses = mainnetConstants;

    const tokens = constants.tokens;

    const provider = hre.ethers.provider;

    const tokensPromise: Promise<TokenResult>[] = Object.entries(tokens).map(async ([key, value], tokenIndex) => {

        const baseTokenPrice = await getTokenPrice(key, constants, provider);

        const baseTokenAmount = AMOUNT/baseTokenPrice;

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

            const accruedValue = await yieldTokenAccruedValue(constants, tranche.address, provider);
            const variableRate = await getVariableAPY(key, constants);


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
                expiry: (new Date(tranche.expiration * 1000)).toString(),
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


const logResults = (results: TokenResult[]) => {
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

    csvWriter.writeRecords(data);
    
}

start().then((results) => {
    logResults(results);
})

const isFilled = <T extends {}>(v: PromiseSettledResult<T>): v is PromiseFulfilledResult<T> => v.status === 'fulfilled';
const isRejected = (v: PromiseSettledResult<any>): v is PromiseRejectedResult => v.status === 'rejected';

// function flattenObject(oldObject: any) {
//     const newObject = {};
  
//     flattenHelper(oldObject, newObject, '');
  
//     return newObject;
  
//     function flattenHelper(currentObject: any, newObject: any, previousKeyName: any) {
//       for (let key in currentObject) {
//         let value = currentObject[key];
  
//         if (value.constructor !== Object) {
//           if (previousKeyName == null || previousKeyName == '') {
//             newObject[key] = value;
//           } else {
//             if (key == null || key == '') {
//               newObject[previousKeyName] = value;
//             } else {
//               newObject[previousKeyName + '.' + key] = value;
//             }
//           }
//         } else {
//           if (previousKeyName == null || previousKeyName == '') {
//             flattenHelper(value, newObject, key);
//           } else {
//             flattenHelper(value, newObject, previousKeyName + '.' + key);
//           }
//         }
//       }
//     }
//   }