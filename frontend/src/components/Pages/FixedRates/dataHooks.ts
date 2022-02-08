import { useQuery } from "@apollo/client";
import { LineData, SeriesMarker } from "lightweight-charts";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { shortenNumber } from "utils/shortenNumber";
import { GET_DAILY_FIXED_RATES, GET_YTC_VOLUME } from "./GraphqlQueries";

export interface DailyOCHL {
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
                    // TODO can replace with business day once localeCompare is not required
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

// const useSMA = (data: DailyOCHL[]) => {
// }

export function simpleMovingAverage(data: DailyOCHL[], window = 3): LineData[] {
  if (!data || data.length < window) {
    return [];
  }

  let index = window - 1;
  const length = data.length;

  const simpleMovingAverages: LineData[] = [];

  while (++index < length) {
    const windowSlice = data.slice(index - window, index);
    const sum: number = windowSlice.reduce((prev, curr) => 
        {
            return +prev + +curr.close
        },
    0);

    const value: number = sum / window;
    simpleMovingAverages.push({
        time: data[index].time,
        value,
    });
  }

  return simpleMovingAverages;
}

export const useSma = (data: DailyOCHL[] | undefined, window: number) => {

    const [sma, setSma] = useState<LineData[] | undefined>(undefined)

    useEffect(() => {
        if (data){
            const result = simpleMovingAverage(data, window);
            setSma(result);
        }
    }, [data, window])

    return sma;
}

interface DailyYTCVolume {
    days: {
        year: number;
        month: number;
        day: number;
        timestamps: Timestamp[];
    }[]
}

interface EntryTransaction {
    yieldTokensReceived: number;
}

interface Timestamp {
    id: string,
    entryTransactions: EntryTransaction[]
}

interface DailyVars {
    termId: string;
}


export const useDailyYtcVolume = (termId: string, decimals: number): SeriesMarker<string>[] | undefined => {
    const { data } = useGetDailyYtcVolume(termId);
    const [resultData, setResultData] = useState<SeriesMarker<string>[] | undefined>(undefined);
    const decimalExponent = useMemo (() => Math.pow(10, decimals), [decimals])

    useEffect(() => {
        // first we want to take all the entryTransactions within a single timestamp and reduce them
        if (data){
            let result = data.days.map((day) => {
                return {
                    text: shortenNumber(day.timestamps.map((timestamp) => {
                        return {
                            ...timestamp,
                            timestampTotal: timestamp.entryTransactions.reduce((prev, current: EntryTransaction) => {
                                return +prev + +current.yieldTokensReceived/decimalExponent
                            }, 0)
                        }
                    }).reduce((prev, curr) => {
                        return prev + curr.timestampTotal;
                    }, 0)) + " YTC",
                    time: (new Date(day.year, day.month, day.day)).toISOString().substring(0, 10),
                    position: 'aboveBar',
                    shape: 'arrowDown'
                } as SeriesMarker<string>
            }).filter((data: SeriesMarker<string>) => data.text !== shortenNumber(0) + " YTC" ).sort((a, b) => a.time.localeCompare(b.time))

            setResultData(result);
        }
    }, [termId, data, decimalExponent])

    return resultData;

}

export const useGetDailyYtcVolume = (termId: string): {
    data: DailyYTCVolume | undefined;
} => {
    const [result, setResult] = useState<DailyYTCVolume | undefined>(undefined);

    const {data} = useQuery<DailyYTCVolume, DailyVars>(
        GET_YTC_VOLUME, 
        {
            variables: {
                termId: termId
            }
        }
    );

    useEffect(() => {
        if (data){
            setResult(data);
        }
    }, [data])

    return { data: result };
}
