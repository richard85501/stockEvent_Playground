import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import useInterval from '../utilities/useInterval';

import { totalRollerData } from '../data/totalRollerData';
import { stocksInfo } from '../data/stocksInfo';
const RollerData = () => {
  const timer = useRef(null);
  const token = import.meta.env.VITE_TOKEN;
  //卷商分點資料api
  const Securities_Trader_Info_Url = 'https://api.finmindtrade.com/api/v4/data?dataset=SecuritiesTraderInfo&device=web';
  //卷商分點在個股買進股票資料
  const Taiwan_Stock_Trading_Daily_Report_Url = 'https://api.finmindtrade.com/api/v4/taiwan_stock_trading_daily_report';
  //台股資料
  const TaiwanStockInfo = 'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo&device=web';

  const [dataList, setDataList] = useState([]);

  const [start_d, setStart_d] = useState(moment('20230103').format('YYYYMMDD'));
  const [end_d, setEnd_d] = useState(moment('20230110').format('YYYYMMDD'));

  const [postInfo, setPostInfo] = useState({ data_id: null, securities_trader_id: null });

  //卷商分點在個股買進股票資料
  //date => 2023-05-06
  const getIndividualRollerData = (data_id, securities_trader_id, date) => {
    let r = `${Taiwan_Stock_Trading_Daily_Report_Url}?data_id=${data_id}&securities_trader_id=${securities_trader_id}&date=${date}&device=web&token=${token}`;
    _axios.get(r).then(function (response) {
      if (response) {
        setDataList(JSON.stringify(response.data.data));
      }
    });
  };

  const callApiTimer = (date, stock_id, securities_trader_id, idx) => {
    timer.current = setTimeInterval(() => {
      console.log(date, stock_id, securities_trader_id);
      // getIndividualRollerData(stock_id, securities_trader_id, date);
      // }, 1000 * idx);
    }, 1000);
    return () => {
      clearTimeInterval(timer);
    };
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //拿取所有卷商在股票下單資料
  const getData = async () => {
    let diff = moment(end_d).diff(start_d, 'days');

    let dateArr = [];
    let i = 0;
    while (i <= diff) {
      dateArr.push(moment(start_d).add(i, 'days').format('YYYY-MM-DD'));
      i++;
    }

    console.log('dateArr', dateArr);

    // dateArr.forEach(async (date, idx) => {
    //   stocksInfo.forEach(async (info) => {
    //     totalRollerData.forEach(async (rollerInfo) => {
    //       await callApiTimer(date, info.stock_id, rollerInfo.securities_trader_id, idx);
    //       await sleep(i * 1000);
    //     });
    //   });
    // });
  };

  return (
    <div>
      RollerData
      <button onClick={() => getData()}>獲得卷商在個股所有資料</button>
      {dataList}
    </div>
  );
};

export default RollerData;
