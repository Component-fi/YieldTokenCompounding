import React, { useState } from 'react';
import {gql} from '@apollo/client';
import { useQuery } from '@apollo/client';
import { Flex, Select } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

type Props = {};

const GET_ASSETS = gql`
    query GetAssets{
        baseTokens{
            id
            name
            symbol
        }
    }
`

const GET_ASSET_TERMS_FIXED_RATES = gql`
    query AssetTermFixedRates($baseTokenId: String!){
        principalPools(where:{baseToken: $baseTokenId}){
            pToken{
                name
            }
            states{
                timestamp{
                    id
                }
                fixedRate
            }
        }
    }
`

interface Assets {
    baseTokens: {
        id: string;
        name: string;
        symbol: string;
    }[]
}

interface Rates {
    principalPools: PoolType[]
}

interface State {
    timestamp: {
        id: string;
    }
    fixedRate: number;
}

interface PoolType {
    pToken: {
        name: "string"
    };
    states: State[]
}

interface Vars {
    baseTokenId: string;
}

export const FixedRatesPage = (props: Props) => {
    const { loading, error, data } = useQuery<Assets>(GET_ASSETS);

    const [selection, setSelection] = useState<string>()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    if (data){
        return <>
            <Select
                onChange={
                    (e: React.ChangeEvent<HTMLSelectElement>) => setSelection(e.target.value)
                }
                defaultValue={selection}
            >
                {data.baseTokens.map((basetoken) => {
                    return <option value={basetoken.id}>{basetoken.symbol}</option>
                })}
            </Select>
            {selection && <FixedRates baseTokenId={selection}/>}
        </>
    }

    return <>
    </>;
};

const FixedRates: React.FC<{baseTokenId: string}> = (props) => {
    const { loading, error, data } = useQuery<Rates, Vars>(
        GET_ASSET_TERMS_FIXED_RATES,
        {
            variables: {
                baseTokenId: props.baseTokenId
            }
        }
    )

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    if (data) return <Flex flexDir="column" gridGap={5} p={10}>
        {
            data.principalPools.map((pool: PoolType) => (
                <Pool {...pool}/>
            ))
        }
    </Flex>

    return <></>
}

const Pool: React.FC<PoolType> = (props) => {

    const data = props.states.map((state: State) => {
        return {
            x: parseInt(state.timestamp.id) * 1000,
            y: state.fixedRate
        }
    })

    return <Line
        data={{
            datasets: [
                {
                    data: data,
                    label: props.pToken.name
                }
            ]
        }}
        options={{
            scales: {
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            hour: "MMM DD, YYYY",
                            day: "MMM DD, YYYY",
                            minute: "MMM DD, YYYY"
                        }
                    },
                    suggestedMin: 0
                }
            }
        }}
    />
}

export default FixedRatesPage;
