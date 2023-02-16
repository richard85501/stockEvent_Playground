import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendGetRequest } from '../../api/helper';
const token =import.meta.env.VITE_TOKEN

// 卷商分點資料
export const getDealerData = createAsyncThunk('dealer/getDealerData', async (par) => {
  const response = await sendGetRequest(
    `/api/v4/data?dataset=TaiwanStockTradingDailyReport&data_id=2330&start_date=2023-02-01&token=${token}`
  );
  return response;
});

//當日前20筆 成交量最高資料 
export const getThpTopTwenty = createAsyncThunk('dealer/getThpTopTwenty', async (par) => {
  const response = await sendGetRequest(`/exchangeReport/MI_INDEX20`);
  console.log('e',response)
  return response;
});

//全部資料

const dealerSlice = createSlice({
  name: 'dealer',
  initialState: {
    twenty:null
  },
  reducers: {

  },  
  extraReducers: {
     // UPDATE ABILITY
     [getThpTopTwenty.pending]: (state) => {
    },
    [getThpTopTwenty.fulfilled]: (state, { payload }) => {
      console.log("payload",payload)
      if (payload.status === 200) {
        state.twenty = payload.data.data;
      }
    },
    [getThpTopTwenty.rejected]: (state) => {
    },
  },
});

// export const { todoAdded, todoToggled } = dealerSlice.actions;
export const selectDealer = (state) => state.dealer;
export default dealerSlice.reducer;
