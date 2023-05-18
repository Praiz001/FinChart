import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

import { useDispatch, useSelector } from 'react-redux';
import { getCandleStickChartData } from "../features/chartSlice";
import {chartData} from "./mocks.js"

const CandlestickChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null)
  
  const dispatch = useDispatch();
  const { candlestickData, newCandlestick, loading } = useSelector((state) => state.chartData);

  useEffect(() => {
    dispatch(getCandleStickChartData())
  }, [])

  
  useEffect(() => {

    const chartOptions = { 
      layout: { 
        textColor: 'black', 
        background: { type: 'solid', color: 'white' } 
      },
      timeScale: {
        fixLeftEdge: true,
        borderVisible: true,
        borderColor: '#A7B1BC50',
        timeVisible: true,
      },
      grid: {
        vertLines: false, 
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: '#2962FF'
        },
        horzLine: {
          labelBackgroundColor: '#2962FF',
        }
      },
      localization:{
        locale: "en-NG",
        timeFormatter: (time) => {
          const date = new Date(time)
          const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
            day: 'numeric',
            year: '2-digit',
            // hour12: true
          })

          return dateFormatter.format(date);
        }
      },
      width: 800,  
      height: 400,
    };

    chartRef.current = createChart(chartContainerRef.current, chartOptions);

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a', 
      downColor: '#ef5350', 
      borderVisible: false, 
      wickUpColor: '#26a69a', 
      wickDownColor: '#ef5350'
    });

    candlestickSeriesRef.current.setData(chartData.candlestickChartDataMock);

    // if (candlestickData.length === 0) return
    // candlestickSeriesRef.current.setData(candlestickData);

    // if (newCandlestick === null) return
    // candlestickSeriesRef.current.update(newCandlestick)
    chartRef.current.timeScale().fitContent();
    
    return () => chartRef.current.remove()
  },[candlestickData, newCandlestick]);

  if (loading) {
    return <p>Loading chart data...</p>
  }

  return <div ref={chartContainerRef} />;
};



export default CandlestickChart



























// const CandlestickChart = ({ data }) => {
//   const chartContainerRef = useRef(null);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (data && data.length > 0 && chartContainerRef.current && !chartRef.current) {
//       chartRef.current = createChart(chartContainerRef.current, {
//         width: 800,  
//         height: 400,
//       });

//       const candleSeries = chartRef.current.addCandlestickSeries();
//       candleSeries.setData(data);
//     }
//   }, [data]);

//   return <div ref={chartContainerRef} />;
// };

// export default CandlestickChart
















// import React, { useEffect, useRef } from 'react';
// import { createChart } from 'lightweight-charts';

// const CandlestickChart = ({ data }) => {
//   const chartContainerRef = useRef(null);
//   const chartInstanceRef = useRef(null);

//   useEffect(() => {
//     if (!chartInstanceRef.current) {
//       chartInstanceRef.current = createChart(chartContainerRef.current, {
//         width: 800,
//         height: 400,
//       });
//     }

//     const chart = chartInstanceRef.current;

//     const candlestickSeries = chart.addCandlestickSeries();

//     const formattedData = data?.map((item) => ({
//       time: item.time,
//       open: item.open,
//       high: item.high,
//       low: item.low,
//       close: item.close,
//     }));

//     candlestickSeries.setData(formattedData);

//     return () => {
//       chart.remove();
//       chartInstanceRef.current = null;
//     };
//   }, [data]);

//   return <div ref={chartContainerRef} />;
// };

// export default CandlestickChart;