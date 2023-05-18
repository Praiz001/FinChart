import { useState, useEffect, useRef } from 'react';
import './App.css'

import CandlestickChart from "./components/CandlestickChart";
import LineChart from './components/LineChart';

import { pushNewLineChartData, pushNewCandlestickData } from './features/chartSlice';
import { useDispatch } from 'react-redux';




function App() {
  const [chartType, setChartType] = useState(sessionStorage.getItem('chartType') || 'line')
  const timeInterval = [ '1D', '1W', '1M', '1Y' ];
  const chartInfo = [
    {
      label: 'Line Chart',
      type: 'line'
    },
    {
      label: 'Candlestick Chart',
      type: 'candlestick'
    }
  ];
  const dispatch = useDispatch();

  const socketRef = useRef(null);

  function formatDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear();
    const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
    const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }


  useEffect(() => {
    sessionStorage.setItem('chartType', chartType);
  }, [chartType])

  
  useEffect(() => {
    socketRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_1m`)
    socketRef.current.onmessage = function (event) {
      const candlestickRawdata = JSON.parse(event.data).k;
      const singleCandle = {
        open: parseFloat(candlestickRawdata.o),
        high: parseFloat(candlestickRawdata.h),
        low: parseFloat(candlestickRawdata.l),
        close: parseFloat(candlestickRawdata.c),
        time: formatDate(candlestickRawdata.T)
      }
      const singleLineDataPoint = {
        value: parseFloat(candlestickRawdata.c),
        time: formatDate(candlestickRawdata.T)
      }
      dispatch(pushNewLineChartData(singleLineDataPoint))
      dispatch(pushNewCandlestickData(singleCandle))
      // console.log('singgg', singleCandle, singleLineDataPoint )
    }

    return () => socketRef.current.close()
  }, []);

  return (
    <main>
      <p>Financial Charts</p>
      <section className='chart_controllers'>
        <div style={{display: "flex", gap: "12px"}}>
          {chartInfo.map((chart, index) => {
            const {label, type} = chart;
            return(
              <button 
              key={index} 
              className={`${chartType === type ? 'active' : " "}`} 
              onClick={() => setChartType(type)}>
                {label}
              </button>
            )
          })}
        </div>
        <div style={{display: "flex", gap: "12px"}}>
          {timeInterval.map((interval) => (
            <button key={interval}>
              {interval}
            </button>
          ))}
        </div>
      </section> 


      <div style={{display: 'inline-block'}}>
        {chartType === 'line' ? ( 
          <LineChart /> ) : ( 
            // <p>Candlestick Chart</p>
            <CandlestickChart  /> 
          )
        }
      </div>
    </main>
  )
}

export default App;


{/* <div>
        <p>Candlestick Chart</p>
        <CandlestickChart  />
    </div> */}
