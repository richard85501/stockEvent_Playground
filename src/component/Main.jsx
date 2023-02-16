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
  const INIT_PERIOD_OF_TESTING = 3; //總計回測天數
  const INIT_PERIOD_OF_BUYING = 3; //放置天數

  let startDayOfTesting = moment(new Date()).subtract(INIT_TESTING_DAYS, 'days').format('YYYYMMDD'); //轉換格式
  let lastDayOfTesting = moment(new Date()).add(INIT_TESTING_DAYS, 'days').format('YYYYMMDD'); //轉換格式

  const [date, setDate] = useState(startDayOfTesting); //正在計算前20的那一天
  const [periodOfTesting, setPeriodOfTesting] = useState(INIT_PERIOD_OF_TESTING); //總計回測天數

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
    //星期天=0 星期六=6
    //計算三天後 是星期幾 如果是假日去陣列裡面抓取下一筆資料的日期 (有點邪門)
    let weeknumber = moment(date, 'YYYYMMDD').add(periodOfTesting, 'days').weekday();
    if (weeknumber == 0 || weeknumber == 6){
      let idx = stocksList.findIndex(item=>moment(item.date).format("YYYYMMDD")===date)
      return stocksList[idx+periodOfTesting].date      
    }else{
      return moment(date).add(periodOfTesting, 'days').format('YYYY-MM-DD')
    }
  };

  const getPorfit = ()=>{
    let a =[]
    profit_per_day.forEach((item,idx)=>{
      if(idx===0) a.push(item*INIT_FUNDS)
      a.push(item*INIT_FUNDS+profit_per_day[idx])
    })
    
    return a
  }

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
    //theTopDailyTwenty 目前前20
    //stocksList 前20單筆資料
    if (theTopDailyTwenty && stocksList.length >= theTopDailyTwenty.length * 13) {
      // item[8] => 收盤價
      let profitArr = [];
      theTopDailyTwenty.forEach((topdata) => {
        //得到回測最後一天資料的開盤值
        // console.log("topdata",topdata)
        // let lastDayData = stocksList.find((item) => item.stock_id === topdata[1] && item.date === getTheWeekOfDate(date));
        let topDataIdxInStocksList = stocksList.findIndex((item) => item.stock_id === topdata[1] && moment(item.date).format("YYYYMMDD") === moment(date).format("YYYYMMDD"));

        let lastDayData = stocksList[+topDataIdxInStocksList+(+INIT_PERIOD_OF_BUYING)] 

        let profit = ((lastDayData?.open * 1000 - topdata[8] * 1000) /(lastDayData?.open * 1000));
        profitArr.push(profit);
        //把算出來的利潤 放進利潤陣列裡
      });
      dispatch(updateProfitPerDay([...profit_per_day,...profitArr ]));

      dispatch(updateTewnty(null));
      dispatch(updateStocksList([]));
      //往後推一天 再計算一次
      let cur = moment(date).add(1, 'days').format('YYYYMMDD');
      dispatch(getThpTopTwenty({ date: cur }));
      setDate(cur);
    }
  }, [theTopDailyTwenty, stocksList, date]);

  console.log('profit_per_day', profit_per_day);
  console.log("stocksList",stocksList)
  console.log("theTopDailyTwenty",theTopDailyTwenty)

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
      <label>{'總計回測天數=>'}</label>
      <input
        value={periodOfTesting}
        placeholder='回測天數'
        onChange={(e) => setPeriodOfTesting(e.target.value)}
        // onKeyDown={(e) => {
        //   if (e.keyCode === 13) setTestDays(e.target.value);
        // }}
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
        <LineGraph data={getPorfit()}/>
      </div>
    </div>
  );
};

export default main;
