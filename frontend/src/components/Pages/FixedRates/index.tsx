import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Flex, Select, Text } from '@chakra-ui/react';
import { useDailyData, useDailyYtcVolume, useSma } from './dataHooks';
import { useCandlestickChart, useChart, useLineChart, useMarkers, useRenderSeries} from '../../../hooks/charting';
import { GET_ASSETS, GET_PRINCIPAL_POOLS } from './GraphqlQueries';

type Props = {};

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

interface PoolType {
    pToken: {
        name: string;
        term: {
            id: string;
            yToken: {
                decimals: number;
            };
        }
    };
    id: string;
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
                    return <option value={basetoken.id} key={basetoken.id}>{basetoken.symbol}</option>
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
        GET_PRINCIPAL_POOLS,
        {
            variables: {
                baseTokenId: props.baseTokenId
            }
        }
    )
    const [selection, setSelection] = useState<PoolType>()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    if (data) return <>
        <Select
            onChange={
                (e: React.ChangeEvent<HTMLSelectElement>) => setSelection(data.principalPools[parseInt(e.target.value)])
            }
        >
            {
                data.principalPools.map((pool: PoolType, i: number) => (
                    <option value={i} key={pool.id}>{pool.pToken.name}</option>
                ))
            }
        </Select>
        {selection && <Pool id={selection.id} pToken={selection.pToken}/>}
    </>
    return <></>
}

const Pool: React.FC<PoolType> = (props) => {
    return <TradingViewChart principalPoolId={props.id} termId={props.pToken.term.id} yTokenDecimals={props.pToken.term.yToken.decimals}/>
}


const TradingViewChart = (props: {principalPoolId: string; termId: string; yTokenDecimals: number}) => {
    // Convert the data to Open, High, Low, Close format

    const { ref, chart } = useChart({
        width: 500,
        height: 300,
        rightPriceScale: {
            scaleMargins: {
                top: 0.3,
                bottom: 0.25
            },
            borderVisible: false,
        },
        // layout: {
        //     backgroundColor: '#131722',
        //     textColor: '#d1d4dc'
        // },
        grid: {
            vertLines: {
                color: 'rgba(42, 46, 57, 0)'
            },
            horzLines: {
                color: 'rgba(42, 46, 57, 0.6)'
            }
        }
    });

    const { candleStickSeries } = useCandlestickChart(chart);
    const { data, loading } = useDailyData(props.principalPoolId);

    useRenderSeries(candleStickSeries, data);

    const { lineSeries: sma3Series } = useLineChart(chart, {
        lineWidth: 1,
        color: "blue",
        title: "3 day SMA"
    });
    const sma3 = useSma(data, 3);
    useRenderSeries(sma3Series, sma3);

    const { lineSeries: sma7Series } = useLineChart(chart, {
        lineWidth: 1,
        color: "orange",
        title: "7 day SMA"
    });
    const sma7 = useSma(data, 7);
    useRenderSeries(sma7Series, sma7);

    const { lineSeries: sma15Series } = useLineChart(chart, {
        lineWidth: 1,
        color: "green",
        title: "15 day SMA"
    });
    const sma15 = useSma(data, 15);
    useRenderSeries(sma15Series, sma15);

    const ytcData = useDailyYtcVolume(props.termId, props.yTokenDecimals);

    useMarkers(candleStickSeries, ytcData);

    return <Flex flexDir="column">
        {
            (loading || !sma3 || !sma7 || !sma15 || !ytcData) && <Text>
                Loading...
            </Text>
        }
        <Flex ref={ref} pt={10}/>
    </Flex>
}


export default FixedRatesPage;
