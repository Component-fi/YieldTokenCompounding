import hre from 'hardhat';
import {createObjectCsvWriter} from 'csv-writer';
import mainnetConstants from '../constants/mainnet-constants.json';
import { ElementAddresses } from '../frontend/src/types/manual/types';
import { simulateAllTranches, SimulationResult } from '../frontend/src/api/ytc/simulateTranches';

const logResults = (results: SimulationResult[], amount: string) => {

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

    csvWriter.writeRecords(results);
    
}

const provider = hre.ethers.provider;
const constants: ElementAddresses = mainnetConstants;

[10000, 50000, 100000, 500000, 1000000].map((number) => {
    simulateAllTranches(number, provider, constants).then((results) => {
        logResults(results, number.toString());
    })
})

