import { useEffect, useState } from 'react';
import styles from './style/Main.module.scss';

import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { selectDealer, getThpTopTwenty, getSingleDataToList, updateTewnty, updateProfitPerDay, updateStocksList } from '../store/slice/dealer';

import LineGraph from '../graph/LineGraph';

const main = () => {
  const dispatch = useDispatch();
  const { theTopDailyTwenty, stocksList, profit_per_day } = useSelector(selectDealer);

  const INIT_FUNDS = 50000; //初始資金
  const INIT_TESTING_DAYS = 44; //預設從這麼多天前開始
  const INIT_PERIOD_OF_TESTING = 4; //總計測試天數
  const INIT_PERIOD_OF_HOLDING = 3; //購買之後放置的天數

  //回傳避開週末所需要的天數
  const getTheWeekOfDate = (date, addDates) => {
    let add = 0;
    //星期天=0 星期六=6
    let weeknumber = moment(date, 'YYYYMMDD').add(addDates, 'days').weekday();
    if (weeknumber === 0) add = 1;
    if (weeknumber === 6) add = 2;

    return add;
  };

  //第幾天賣出
  const addTheDateSkippingWeekend = (d, addDates) => {
    return moment(d)
      .add(addDates + getTheWeekOfDate(d, addDates), 'days')
      .format('YYYY-MM-DD');
  };

  const START_DATE_OF_TESTING = moment(new Date()).subtract(INIT_TESTING_DAYS, 'days').format('YYYYMMDD'); //轉換格式

  const LASTDATE_OF_TESTING = moment(START_DATE_OF_TESTING)
    .add(INIT_PERIOD_OF_TESTING + getTheWeekOfDate(INIT_PERIOD_OF_TESTING), 'days')
    .format('YYYYMMDD'); //轉換格式

  const [date, setDate] = useState(START_DATE_OF_TESTING); //正在計算前20的那一天 第一天測試日期
  const [theLastTestingDate, setTheLastTestingDate] = useState(LASTDATE_OF_TESTING); //最後測試日期

  const [isTopDataGet, setIsTopDataGet] = useState(false); //是否拿到前20筆資料 買進日期的資料
  const [isSingleDataGet, setIsSingleDataGet] = useState(false); //是否拿到前20筆資料 賣出日期的資料

  const [periodOfTesting, setPeriodOfTesting] = useState(INIT_PERIOD_OF_TESTING); //總計測試天數
  const [periodOfHolding, setPeriodOfHolding] = useState(INIT_PERIOD_OF_HOLDING); //購買之後放置的天數

  const [isCaculate, setIsCaculate] = useState(false);

  //開始計算
  const getThpTopTwentyHandler = () => {
    setIsCaculate(true);
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

  const getPorfit = () => {
    let a = [];
    profit_per_day.forEach((item, idx) => {
      if (idx === 0) a.push(item * INIT_FUNDS);
      a.push(item * INIT_FUNDS + profit_per_day[idx]);
    });

    return a;
  };

  useEffect(() => {
    if (date === theLastTestingDate) {
      setIsCaculate(false);
    }
  }, [date, theLastTestingDate]);

  //拿取前20筆資料
  useEffect(() => {
    console.log('date', date);
    console.log('theLastTestingDate', theLastTestingDate);
    console.log('isTopDataGet', isTopDataGet);
    console.log('theTopDailyTwenty', theTopDailyTwenty);
    if (isCaculate && date !== theLastTestingDate && !isTopDataGet && !theTopDailyTwenty) {
      dispatch(getThpTopTwenty({ date: date }));
      setIsTopDataGet(true);
    }
  }, [dispatch, isTopDataGet, theTopDailyTwenty, theLastTestingDate, date, isCaculate]);

  //得到第一天的前20筆資料 && 單獨的資料還未抓取
  useEffect(() => {
    if (date !== theLastTestingDate) {
      if (theTopDailyTwenty && !isSingleDataGet) {
        theTopDailyTwenty.forEach((item, idx) =>
          dispatch(
            getSingleDataToList({
              data_id: item[1],
              start_date: addTheDateSkippingWeekend(date, periodOfHolding),
              end_date: addTheDateSkippingWeekend(date, periodOfHolding),
            })
          )
        );
        setIsSingleDataGet(true);
      }
    }
  }, [dispatch, theTopDailyTwenty, date, isSingleDataGet, periodOfHolding]);

  useEffect(() => {
    //theTopDailyTwenty 目前前20
    //stocksList 前20單筆資料
    if (theTopDailyTwenty && stocksList.length >= theTopDailyTwenty.length * 2) {
      //為了解決api會多回傳一筆資料問題
      let sellsDayPrice = stocksList.filter((item) => item.date === addTheDateSkippingWeekend(date, periodOfHolding));

      // item[8] => 收盤價
      let profitArr = [];
      theTopDailyTwenty.forEach((topdata) => {
        //得到回測最後一天資料的開盤值
        let lastDateData = sellsDayPrice.find((item) => item.stock_id === topdata[1]);

        //把算出來的利潤 放進利潤陣列裡
        let profit = (lastDateData?.open * 1000 - topdata[8] * 1000) / (lastDateData?.open * 1000);
        profitArr.push(profit);
      });
      dispatch(updateProfitPerDay([...profit_per_day, ...profitArr]));

      //重置
      dispatch(updateTewnty(null));
      dispatch(updateStocksList([]));
      setIsTopDataGet(false);
      setIsSingleDataGet(false);
      //往後推一天
      let cur = moment(date)
        .add(1 + getTheWeekOfDate(date, 1), 'days')
        .format('YYYYMMDD');
      console.log('cur', cur);
      setDate(cur);
    }
  }, [dispatch, theTopDailyTwenty, stocksList, date, profit_per_day, periodOfHolding]);

  // console.log('profit_per_day', profit_per_day);
  // console.log('stocksList', stocksList);
  // console.log('theTopDailyTwenty', theTopDailyTwenty);

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
      <label>{'購買之後放置的天數=>'}</label>
      <input value={periodOfHolding} placeholder='放置天數' onChange={(e) => setPeriodOfHolding(e.target.value)} />
      <label>{'總計測試天數=>'}</label>
      <input
        value={periodOfTesting}
        placeholder='測試天數'
        onChange={(e) => {
          setPeriodOfTesting(e.target.value);
          setTheLastTestingDate(addTheDateSkippingWeekend(date, e.target.value));
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
        <LineGraph data={getPorfit()} />
      </div>
    </div>
  );
};

export default main;
