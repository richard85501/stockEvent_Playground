import React, { useEffect, useState } from 'react';
import _axios from 'axios';
import moment from 'moment';

const Strategy = () => {
  // let url = 'https://www.twse.com.tw/exchangeReport/MI_INDEX20?date=20230105';
  let url = 'https://www.twse.com.tw/exchangeReport/MI_INDEX20';

  const [data, setData] = useState([]);

  const [start_d, setStart_d] = useState(moment('20230103').format('YYYYMMDD'));
  const [end_d, setEnd_d] = useState(moment('20230110').format('YYYYMMDD'));

  const callApiTimer = (item, idx) => {
    let interval = setTimeout(() => {
      postObj(item);
    }, 10000 * idx);
    return () => {
      clearTimeout(interval);
    };
  };

  const postObj = (item) => {
    let dataArr = [...data];
    let r = url + `?date=${item}`;
    _axios.get(r).then(function (response) {
      if (response.data.date) {
        let target = {};
        target.date = response.data.date;
        target.data = response.data.data;
        setData([...dataArr, target]);
      }
    });
  };

  const getData = () => {
    let diff = moment(end_d).diff(start_d, 'days');

    let dateArr = [];
    let i = 0;
    while (i <= diff) {
      dateArr.push(moment(start_d).add(i, 'days').format('YYYYMMDD'));
      i++;
    }

    dateArr.forEach((item, idx) => {
      callApiTimer(item, idx);
    });
  };

  return (
    <div>
      Strategy
      <button onClick={() => getData()}>獲得資料</button>
    </div>
  );
};

export default Strategy;
