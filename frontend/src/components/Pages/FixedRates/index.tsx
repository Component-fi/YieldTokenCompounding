import React, { useEffect, useState } from 'react';
import {gql} from '@apollo/client';
import { useQuery } from '@apollo/client';
import { Flex, Select } from '@chakra-ui/react';
import { useCandlestickChart, useDailyData } from './hooks';

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
            id,
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

interface PoolType {
    pToken: {
        name: string;
        expiration: string;
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
    const [selection, setSelection] = useState<PoolType>()

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    console.log(data);

    if (data) return <>
        <Select
            onChange={
                (e: React.ChangeEvent<HTMLSelectElement>) => setSelection(data.principalPools[parseInt(e.target.value)])
            }
        >
            {
                data.principalPools.map((pool: PoolType, i: number) => (
                    <option value={i}>{pool.pToken.name}</option>
                ))
            }
        </Select>
        {selection && <Pool id={selection.id} pToken={selection.pToken}/>}
    </>
    return <></>
}

const Pool: React.FC<PoolType> = (props) => {
    return <TradingViewChart principalPoolId={props.id}/>
}


const TradingViewChart = (props: {principalPoolId: string}) => {
    // Convert the data to Open, High, Low, Close format
    const {ref, candleStickSeries} = useCandlestickChart();

    const {data, loading } = useDailyData(props.principalPoolId);

    console.log(data);

    useEffect(() => {
        if (candleStickSeries && !loading){
            if (data){
                console.log(data);
                candleStickSeries.setData(
                    data
                )
            }
        }
    }, [candleStickSeries, data, loading])

    return <Flex ref={ref} w="full" h="300px">
    </Flex>
}


export default FixedRatesPage;
