import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendGetRequest } from '../../api/helper';
const token = import.meta.env.VITE_TOKEN;

// 卷商分點資料
export const getDealerData = createAsyncThunk('dealer/getDealerData', async (par) => {
  const response = await sendGetRequest(`/api/v4/data?dataset=TaiwanStockTradingDailyReport&data_id=2330&start_date=2023-02-01&token=${token}`);
  return response;
});

//當日前20筆成交量最高股票的資料
export const getThpTopTwenty = createAsyncThunk('dealer/getThpTopTwenty', async (par) => {
  const response = await sendGetRequest(`/exchangeReport/MI_INDEX20?date=${par.date}`);
  return response.data;
});

//單一股票特定日期 股價資料
export const getSingleDataToList = createAsyncThunk('dealer/getSingleDataToList', async ({ data_id, start_date, end_date }) => {
  const response = await sendGetRequest(
    `/api/v4/data?dataset=TaiwanStockPrice&data_id=${data_id}&start_date=${start_date}&end_date=${end_date}&token=${token}`
  );
  return response.data;
});

//全部資料

const dealerSlice = createSlice({
  name: 'dealer',
  initialState: {
    loading: false,

    theTopDailyTwenty: null,
    stocksList: [],
    profit_per_day: [], //{date:2021-01-03,profit:100,profitPercent:3%}
  },
  reducers: {
    updateTewnty: (state, action) => {
      state.theTopDailyTwenty = action.payload;
    },
    updateProfitPerDay: (state, action) => {
      state.profit_per_day = action.payload;
    },
    updateStocksList: (state, action) => {
      state.stocksList = action.payload;
    },
  },
  extraReducers: {
    // 取得當日最前面十筆資料
    [getThpTopTwenty.pending]: (state) => {
      state.loading = true;
    },
    [getThpTopTwenty.fulfilled]: (state, { payload }) => {
      if (payload.stat == 'OK') {
        state.loading = false;
        state.theTopDailyTwenty = payload.data.slice(0, 5);
      }
    },
    [getThpTopTwenty.rejected]: (state) => {
      state.loading = false;
    },

    // 取得單一股票資料
    [getSingleDataToList.pending]: (state) => {
      state.loading = true;
    },
    [getSingleDataToList.fulfilled]: (state, { payload }) => {
      if (payload.status == 200) {
        state.loading = false;
        let arr = [...state.stocksList];
        arr = [...arr, ...payload.data];
        state.stocksList = arr;
      }
    },
    [getSingleDataToList.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export const { updateTewnty, updateProfitPerDay, updateStocksList } = dealerSlice.actions;
export const selectDealer = (state) => state.dealer;
export default dealerSlice.reducer;
