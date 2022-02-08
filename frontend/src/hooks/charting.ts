import { ChartOptions, createChart, DeepPartial, HistogramStyleOptions, IChartApi, ISeriesApi, LineStyleOptions, SeriesMarker, SeriesOptionsCommon } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

export const useChart = (options?: DeepPartial<ChartOptions>) => {
    const ref = useRef<HTMLDivElement>(null);

    const [chart, setChart] = useState<IChartApi | undefined>(undefined);

    useEffect(() => {
        if (ref.current){
            const cha = createChart(ref.current, options);
            setChart(cha);
        }
    }, [setChart, ref]) //eslint-disable-line

    return {
        ref,
        chart
    }
}
export const useCandlestickChart = (chart?: IChartApi) => {

    const [candleStickSeries, setCandleStickSeries] = useState<ISeriesApi<"Candlestick"> | undefined>(undefined)

    useEffect(() => {
        if (chart){
            const candleStickSeries = chart.addCandlestickSeries()
            setCandleStickSeries(candleStickSeries);
            return () => {
                chart.removeSeries(candleStickSeries)
            }
        }
    }, [chart])

    return {
        candleStickSeries
    }
}

export const useLineChart = (chart: IChartApi | undefined, options?: DeepPartial<LineStyleOptions & SeriesOptionsCommon>) => {
    const [lineSeries, setLineSeries] = useState<ISeriesApi<"Line"> | undefined>(undefined)

    useEffect(() => {
        if (chart){
            const ls = chart.addLineSeries(options);
            setLineSeries(ls);
            return () => {
                chart.removeSeries(ls);
            }
        }
    }, [chart]) //eslint-disable-line

    return {
        lineSeries
    }
}

export const useHistogram = (chart: IChartApi | undefined, options?: DeepPartial<HistogramStyleOptions & SeriesOptionsCommon>) => {
    const [histogramSeries, setHistogramSeries] = useState<ISeriesApi<"Histogram"> | undefined>(undefined);

    useEffect(() => {
        if (chart){
            // TODO style the histogram
            const hs = chart.addHistogramSeries();
            setHistogramSeries(hs)
            return () => {
                chart.removeSeries(hs)
            }
        }
    }, [chart])

    return {
        histogramSeries
    }
}

export const useRenderSeries = (series: ISeriesApi<any> | undefined, data: any[] | undefined) => {
    useEffect(() => {
        if (series && data){
            series.setData(data);
        }
    }, [series, data])
}

export const useMarkers = (series: ISeriesApi<any> | undefined, markers: SeriesMarker<string>[] | undefined) => {
    useEffect(() => {
        if (series && markers){
            series.setMarkers(markers)
        }
    }, [series, markers])
}