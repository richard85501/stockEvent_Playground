import React, { useState } from 'react';
import _axios from 'axios';

import { totalRollerData } from '../data/totalRollerData';

const MainInfo = () => {
  const token = import.meta.env.VITE_TOKEN;
  //卷商分點資料api
  const Securities_Trader_Info_Url = 'https://api.finmindtrade.com/api/v4/data?dataset=SecuritiesTraderInfo&device=web';
  //卷商分點在個股買進股票資料
  const Taiwan_Stock_Trading_Daily_Report_Url = 'https://api.finmindtrade.com/api/v4/taiwan_stock_trading_daily_report';
  //台股資料
  const TaiwanStockInfo = 'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo&device=web';

  const [data, setData] = useState([]);
  const [bigRollers, setBigRollers] = useState(null);

  //拿取卷商資料
  const getRollerInfo = () => {
    let r = `${Securities_Trader_Info_Url}?token=${token}`;
    _axios.get(r).then(function (response) {
      if (response) {
        setData(JSON.stringify(response.data.data));
      }
    });
  };

  //拿取大盤資料
  const getStocksInfo = () => {
    let r = `${TaiwanStockInfo}?token=${token}`;
    _axios.get(r).then(function (response) {
      if (response) {
        let obj = response.data.data;

        let newObj = obj.filter(
          (item) =>
            item.industry_category !== 'ETF' &&
            item.industry_category !== 'Index' &&
            item.industry_category !== '大盤' &&
            item.industry_category !== '存託憑證' &&
            item.industry_category !== '所有證券' &&
            item.industry_category !== '存託憑證' &&
            item.industry_category !== '指數投資證券(ETN)' &&
            item.industry_category !== 'ETN' &&
            item.industry_category !== '受益證券' &&
            item.industry_category !== '上櫃指數股票型基金(ETF)' &&
            item.type === 'twse' &&
            !item.stock_name.includes('甲特') &&
            !item.stock_name.includes('乙特') &&
            !item.stock_name.includes('丙特')
        );

        let filterObj = newObj.filter((data, index, array) => {
          return array.findIndex((item) => item.stock_id == data.stock_id) === index;
        });

        setData(JSON.stringify(filterObj));
      }
    });
  };

  //篩選卷商本身資料
  const filterRollerData = () => {
    let rollerArr = totalRollerData.filter((item) => !item.securities_trader.includes('-'));
    setBigRollers(JSON.stringify(rollerArr));
  };

  //卷商分點在個股買進股票資料
  //date => 2023-05-06
  const getIndividualRollerData = (data_id, securities_trader_id, date) => {
    let r = `${Taiwan_Stock_Trading_Daily_Report_Url}?data_id=${data_id}&securities_trader_id=${securities_trader_id}&date=${date}&device=web&token=${token}`;
    _axios.get(r).then(function (response) {
      if (response) {
        setData(JSON.stringify(response.data.data));
      }
    });
  };

  const callApiTimer = (date, idx) => {
    let interval = setTimeout(() => {
      getIndividualRollerData(date);
    }, 10000 * idx);
    return () => {
      clearTimeout(interval);
    };
  };

  //拿取所有卷商在股票下單資料
  const getFullStocksDataByRollerData = () => {};

  return (
    <div>
      <button onClick={() => getRollerInfo()}>獲得卷商資料</button>
      <button onClick={() => getStocksInfo()}>獲得台股資料</button>
      <button onClick={() => filterRollerData()}>篩選卷商資料</button>
      -------
      {/* <button onClick={() => getFullStocksDataByRollerData()}>獲得卷商在個股所有資料</button> */}
      {data}
      {bigRollers}
    </div>
  );
};

export default MainInfo;
