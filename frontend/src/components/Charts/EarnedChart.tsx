import React from 'react';
import { Chart } from 'react-charts';
import { useRecoilValue } from 'recoil';
import { calculateGain } from '../../features/ytc/ytcHelpers';
import { simulationResultsAtom } from '../../recoil/simulationResults/atom';
import { trancheSelector } from '../../recoil/trancheRates/atom';

// interface Props {
//     label: string;
//     data: number[][];
//     axes: 
// }

export const MyChart = ({index}: {index: number}) => {
  const simulationResults = useRecoilValue(simulationResultsAtom);
  const trancheAddress = simulationResults[0]?.inputs.trancheAddress;
  const trancheRates = useRecoilValue(trancheSelector(trancheAddress));

  const getDataMore = (eachRate: number[], index: number) => {
    const result = simulationResults[index];
    return getData(eachRate, result.receivedTokens.yt.amount, result.tranche.expiration, result.spentTokens.baseTokens.amount, result.gas.baseToken, (trancheRates.accruedValue || 0))
  }

  const getData = (eachRate: number[], ytExposure: number, trancheExpiration: number, baseTokensSpent: number, estimatedBaseTokensSpent: number, yieldTokenAccruedValue: number) => {
    return eachRate.map((n: number) => {
      const gain = calculateGain(ytExposure, n, trancheExpiration, baseTokensSpent, estimatedBaseTokensSpent, yieldTokenAccruedValue).netGain;

      return [n, gain]
    })
  }

  console.log(getDataMore([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], index))

  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: getDataMore([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], index)
      }
    ],
    []
  )
 
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
 
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    return <div
        style={{
        width: '400px',
        height: '300px'
        }}>
      <Chart data={data} axes={axes} />
    </div>
}