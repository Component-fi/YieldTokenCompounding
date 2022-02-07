import { gql, useQuery } from "@apollo/client";
import { createChart, ISeriesApi } from "lightweight-charts";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";


export const useCandlestickChart = () => {
    const ref = useRef<HTMLDivElement>(null);

    const [candleStickSeries, setCandleStickSeries] = useState<ISeriesApi<"Candlestick"> | undefined>(undefined)

    useEffect(() => {
        if (ref.current){
            const chart = createChart(ref.current);
            const candleStickSeries = chart.addCandlestickSeries()
            setCandleStickSeries(candleStickSeries);
        }
    }, [ref])

    return {
        ref,
        candleStickSeries
    }
}

interface DailyOCHL {
    time: string,
    open: number,
    high: number,
    low: number,
    close: number,
}

interface Vars {
    principalPoolId: string;
}

interface State {
    fixedRate: number;
}

interface Data {
    days: {
        day: number,
        month: number,
        year: number,
        timestamps: {
            id: string
            principalPoolState: State[]
        }[]
    }[]
}

export const useDailyData = (principalPoolId: string) => {
    
    const GET_DAILY_FIXED_RATES = gql`
        query GetAssets(
            $principalPoolId: String!
        ){
            days(first: 1000){
                year
                month
                day
                timestamps(first: 1000, orderBy: id){
                    id
                    principalPoolState(where:{pool: $principalPoolId}){
                        fixedRate
                    }
                }
            }
        }
    `

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [processedData, setProcessedData] = useState<DailyOCHL[] | undefined>(undefined);

    const {data, loading, error} = useQuery<Data, Vars>(GET_DAILY_FIXED_RATES, 
        {
            variables: {
                principalPoolId
            }
        }
    );

    useEffect(() => {
        if (!loading){
            if (data){
                const results: DailyOCHL[] = (data.days.map((day) => {
                    const time = (new Date(day.year, day.month, day.day)).toISOString().substring(0, 10);

                    const high = _.maxBy(day.timestamps, (timestamp) => timestamp.principalPoolState[0]?.fixedRate)?.principalPoolState[0].fixedRate
                    const low = _.minBy(day.timestamps, (timestamp) => timestamp.principalPoolState[0]?.fixedRate)?.principalPoolState[0].fixedRate

                    const open = _.find(day.timestamps, (timestamp) => !!timestamp.principalPoolState[0]?.fixedRate)?.principalPoolState[0].fixedRate
                    const close = _.findLast(day.timestamps, (timestamp) => !!timestamp.principalPoolState[0]?.fixedRate)?.principalPoolState[0].fixedRate

                    if (time && high && low && open && close){
                        return {
                            time,
                            high,
                            low,
                            open,
                            close
                        }
                    }
                    else {
                        return undefined;
                    }

                }).filter((day) => !!day) as DailyOCHL[]).sort((a, b) => a.time.localeCompare(b.time))

                setProcessedData(results);
                setIsLoading(false);
            }
        }
    }, [data, loading])

    return {
        data: processedData,
        loading: isLoading,
        error: error,
    }
}