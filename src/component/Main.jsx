import { useEffect, useState } from 'react';
import styles from './style/Main.module.scss';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectDealer, getThpTopTwenty, getSingleDataToList, updateTewnty, updateProfitPerDay, updateStocksList } from '../store/slice/dealer';
import { sendGetRequest } from '../api/helper';

import LineGraph from '../graph/LineGraph';

const main = () => {
  const dispatch = useDispatch();
  const { theTopDailyTwenty, stocksList, profit_per_day } = useSelector(selectDealer);

  const INIT_FUNDS = 500; //初始資金
  const INIT_TESTING_DAYS = 44; //預設從這麼多天前開始
  const INIT_PERIOD_OF_TESTING = 3; //預設回測天數

  let startDayOfTesting = moment(new Date()).subtract(INIT_TESTING_DAYS, 'days').format('YYYYMMDD'); //轉換格式
  let lastDayOfTesting = moment(new Date()).add(INIT_TESTING_DAYS, 'days').format('YYYYMMDD'); //轉換格式

  const [date, setDate] = useState(startDayOfTesting); //正在計算前20的那一天
  const [testDays, setTestDays] = useState(INIT_PERIOD_OF_TESTING); //總共要回測幾天

  //開始計算
  const getThpTopTwentyHandler = () => {
    dispatch(getThpTopTwenty({ date: date }));
  };

  //介面 - 計算顯示顏色
  const directionHandler = (start, end) => {
    const diff = (end * 100 - start * 100) / 100;
    let className = '';
    if (diff == 0) className = styles['notMoving'];
    if (diff > 0) className = styles['grow'];
    if (diff < 0) className = styles['drop'];
    return className;
  };

  //判斷是否為假日
  const getTheWeekOfDate = (date) => {
    let add = 0;
    //星期天=0 星期六=6
    let weeknumber = moment(date, 'YYYYMMDD').weekday();
    if (weeknumber === 0) add = 1;
    if (weeknumber === 6) add = 2;
    return moment(date)
      .add(testDays + add, 'days')
      .format('YYYY-MM-DD');
  };

  //得到第一天的前20筆資料 && 單獨的資料還未抓取
  useEffect(() => {
    if (date !== lastDayOfTesting) {
      if (theTopDailyTwenty && stocksList.length === 0) {
        theTopDailyTwenty.forEach((item, idx) =>
          dispatch(getSingleDataToList({ data_id: item[1], start_date: '2023-01-03', end_date: '2023-02-01' }))
        );
      }
    }
  }, [theTopDailyTwenty, stocksList, date]);

  useEffect(() => {
    var weeknumber = moment('20230220', 'YYYYMMDD').weekday();
    console.log(weeknumber);
    console.log('stocksList', stocksList);
    //theTopDailyTwenty 目前前20
    //stocksList 前20單筆資料
    if (theTopDailyTwenty && stocksList.length >= theTopDailyTwenty.length * 13) {
      // item[8] => 收盤價
      let profitArr = [];
      console.log('date', date);
      theTopDailyTwenty.forEach((topdata) => {
        console.log('topdata', topdata);
        console.log('compare222', moment(date).add(testDays, 'days').format('YYYY-MM-DD'));
        console.log('compare', getTheWeekOfDate(testDays));
        console.log(
          'single',
          stocksList.find((item) => item.stock_id === topdata[1] && item.date === getTheWeekOfDate(date))
        );
        //得到回測天數之後的那筆資料的開盤值
        let lastDayOpenPrice = stocksList.find((item) => item.stock_id === topdata[1] && item.date === getTheWeekOfDate(date)).open;
        //
        let profit = (lastDayOpenPrice * 1000 - topdata[8] * 1000) / 1000;
        profitArr.push(profit);
        //把算出來的利潤 放進利潤陣列裡
        dispatch(updateProfitPerDay([...profitArr, ...profit_per_day]));
      });

      dispatch(updateTewnty(null));
      dispatch(updateStocksList([]));
      //往後推一天 再計算一次
      let cur = moment(date).add(1, 'days').format('YYYYMMDD');
      dispatch(getThpTopTwenty({ date: cur }));
      setDate(cur);
    }
  }, [theTopDailyTwenty, stocksList, date]);

  console.log('profit_per_day', profit_per_day);

  // const getDaysAfterHandler = (curId, isAfter) => {
  //   let data = stocksList.find((item) => item.stock_id === curId && item.date === moment(date).add(isAfter, 'days').format('YYYY-MM-DD'));
  //   if (!data) return '無資料';
  //   return data;
  // };

  // const getDiffPrice = (start, end) => {
  //   return (end - start).toFixed(2);
  // };

  return (
    <div>
      <button onClick={() => getThpTopTwentyHandler()}>取得該日前20名成交量</button>
      <label>{'回測天數=>'}</label>
      <input
        value={testDays}
        placeholder='回測天數'
        onKeyDown={(e) => {
          if (e.keyCode === 13) setTestDays(e.target.value);
        }}
      />
      <input
        placeholder='YYYYMMDD'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) getThpTopTwentyHandler();
        }}
      />
      {/* <div>{JSON.stringify(twenty)}</div> */}
      <div className={styles.info}>
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>證卷代號</th>
              <th>證券名稱</th>
              {/* <th>成交股數</th>
            <th>成交筆數</th> */}
              <th>開盤價</th>
              <th>最高價</th>
              <th>開低價</th>
              <th>收盤價</th>
              <th>漲跌價差</th>
              <th>開盤收盤價差</th>
              {/* <th>2d漲/跌</th>
              <th>2d 開盤價</th> */}
              {/* <th>10d漲/跌</th>
              <th>10d 開盤價</th> */}
            </tr>
          </thead>
          <tbody>
            {theTopDailyTwenty?.map((item, idx) => (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                {/* <td>{item[3]}</td>
                <td>{item[4]}</td> */}
                <td>{item[5]}</td>
                <td>{item[6]}</td>
                <td>{item[7]}</td>
                <td>{item[8]}</td>
                <td className={directionHandler(item[5], item[8])}>{item[10]}%</td>
                <td className={directionHandler(item[5], item[8])}>{(item[8] - item[5]).toFixed(2)}</td>

                {/* <td className={directionHandler(item[8], getDaysAfterHandler(item[1], 2).close)}>
                  {stocksList[idx] && getDiffPrice(item[8], getDaysAfterHandler(item[1], 2).close)}
                </td>
                <td>{stocksList[idx] && getDaysAfterHandler(item[1], 2).close}</td> */}

                {/* <td className={directionHandler(item[8], getDaysAfterHandler(item[1], 10).close)}>
                  {stocksList[idx] && getDiffPrice(item[8], getDaysAfterHandler(item[1], 10).close)}$
                </td>
                <td>{stocksList[idx] && getDaysAfterHandler(item[1], 10).close}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.chart}>
        <LineGraph />
      </div>
    </div>
  );
};

export default main;
