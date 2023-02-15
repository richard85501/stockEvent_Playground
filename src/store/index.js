import { configureStore } from '@reduxjs/toolkit';
import dealerReducer from './slice/dealer';
// import filtersReducer from '../features/filters/filtersSlice'

const store = configureStore({
  reducer: {
    dealer: dealerReducer,
  },
});

export default store;
