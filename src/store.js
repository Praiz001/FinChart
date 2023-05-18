import { configureStore } from '@reduxjs/toolkit';
import chartReducer from "./features/chartSlice";


export default configureStore({
  reducer: {
    chartData: chartReducer,
  }
});