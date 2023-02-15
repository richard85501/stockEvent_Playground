import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendGetRequest } from '../../api/helper';

// 卷商分點資料
export const getDealerData = createAsyncThunk('dealer/getDealerData', async (par) => {
  const response = await sendGetRequest(
    `/api/v4/data?dataset=TaiwanStockShareholding&data_id=2330&start_date=2023-02-01&end_date=2023-02-10&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMy0wMi0xNSAxMDo1NTo0MSIsInVzZXJfaWQiOiJ3aW53aW5jaGFuZyIsImlwIjoiMTE0LjM0LjE2My4yMTgifQ.fAwetRAVXhpFy_rEJMZWNgfIzgkVRu1dPz3MZgaltp0`
  );
  return response;
});

//每天資訊
export const getEventList = createAsyncThunk('dealer/eventList', async (par) => {
  const response = await sendGetRequest(`/news/eventList`);
  return response;
});

const dealerSlice = createSlice({
  name: 'dealerSlice',
  initialState: [],
  reducers: {},
});

// export const { todoAdded, todoToggled } = dealerSlice.actions;
export default dealerSlice.reducer;
