import {useRef, useEffect} from 'react'
import { createChart } from 'lightweight-charts';

import { useSelector, useDispatch } from 'react-redux';
import { getCandleStickChartData } from "../features/chartSlice";
import { chartData } from './mocks.js';




const LineChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const areaSeriesRef = useRef(null);
  const dispatch = useDispatch();
  
  const { linechartData, newLineDataPoint, loading } = useSelector((state) => state.chartData);

  useEffect(() => {
    dispatch(getCandleStickChartData())
  }, [])

  // useEffect(() => {
  //   if (linechartData.length === 0) return
  //   areaSeriesRef.current.setData(linechartData);
  //   chartRef.current.timeScale().fitContent();
  // }, [linechartData])

  // useEffect(() => {
  //   console.log({ newLineDataPoint })
  //   if (newLineDataPoint === null) return
  //   areaSeriesRef.current.update(newLineDataPoint)
  // }, [newLineDataPoint])

  // useEffect(() => {
  //   console.log({ linechartData, newLineDataPoint, loading })
  // }, [linechartData, newLineDataPoint, loading])

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
        // tickMarkFormatter: (time, tickMarkType, locale) => {
        //   const date = new Date(time);
        //   switch(tickMarkType) {
        //     case TickMarkType.Year:
        //       return date.getFullYear();

        //     case TickMarkType.Month: {
        //       const monthFormatter = new Intl.DateTimeFormat(locale, {
        //         month: "short",
        //       });

        //       return monthFormatter.format(date);
        //     }

        //     case TickMarkType.DayOfMonth:
        //       return date.getDate();

        //     case TickMarkType.Time:{
        //       const timeFormatter = new Intl.DateTimeFormat(locale, {
        //         hour: "numeric",
        //         minute: "numeric",
        //         // hour12: true
        //       });

        //       return timeFormatter.format(date);
        //     }

        //     case TickMarkType.TimeWithSeconds:{
        //       const timeWithSecondsFormatter = new Intl.DateTimeFormat(locale, {
        //         hour: "numeric",
        //         minute: "numeric",
        //         second: "numeric",
        //         // hour12: true
        //       });

        //       return timeWithSecondsFormatter.format(date);
        //     }

        //     default: console.log("There is a problem if you see this")
        //   }
        // }
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

    areaSeriesRef.current = chartRef.current.addAreaSeries({
      lineColor: '#2962FF', 
      topColor: '#2962FF', 
      bottomColor: 'rgba(41, 98, 255, 0.28)' 
    });

    areaSeriesRef.current.setData(chartData.lineChartDataMock);

    // if (linechartData.length === 0) return
    // areaSeriesRef.current.setData(linechartData);

    // if (newLineDataPoint === null) return
    // areaSeriesRef.current.update(newLineDataPoint)

    chartRef.current.timeScale().fitContent();
    
    return () => chartRef.current.remove();
  }, [linechartData, newLineDataPoint]);


  if (loading) {
    return <p>Loading chart data...</p>
  }
  return  <div ref={chartContainerRef} />
}

export default LineChart