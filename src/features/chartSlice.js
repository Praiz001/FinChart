import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const initialState = {
  linechartData: [],
  candlestickData: [],
  loading: false,
  newLineDataPoint: null,
  newCandlestick: null,
};

export const getCandleStickChartData = createAsyncThunk('candlestickchart/getCandleStickChartData', async (thunkAPI) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=200');
    const data = response.data;
    const candlestickData = []
    const lineData = []
    data.forEach((item) => {
      candlestickData.push({
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        time: item[0],
      })
      lineData.push({
        value: parseFloat(item[4]),
        time: item[0],
      })
    })
    return { candlestickData, lineData }; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})


export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    pushNewLineChartData: (state, action) => {
      state.linechartData.push(action.payload);
      state.newLineDataPoint = action.payload;
      console.log('execution has gotten to the reducer')
    },
    pushNewCandlestickData: (state, action) => {
      state.candlestickData.push(action.payload);
      state.newCandlestick = action.payload;
      console.log('execution has gotten to the reducer')
    }
  },
  extraReducers: {
    //candlestick starts here 
    [getCandleStickChartData.pending] : (state) => {
      state.loading = true
    },
    [getCandleStickChartData.fulfilled] : (state, action) => {
      // console.log('payload', action.payload)
      state.loading = false
      state.candlestickData = action.payload.candlestickData;
      state.linechartData = action.payload.lineData;
    },
    [getCandleStickChartData.rejected] : (state, action) => {
      state.loading = false
      console.log('error', action.payload)
    },
  }
});

// this is for dispatch
export const {pushNewLineChartData, pushNewCandlestickData  } = chartSlice.actions;

// this is for configureStore
export default chartSlice.reducer;