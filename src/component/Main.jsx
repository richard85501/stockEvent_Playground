import { useState } from 'react';
import styles from './style/Main.module.scss';

import { selectDealer, getThpTopTwenty } from '../store/slice/dealer';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const main = () => {
  const dispatch = useDispatch();
  const { twenty } = useSelector(selectDealer);
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'days').format('YYYYMMDD'));

  const getThpTopTwentyHandler = () => {
    dispatch(getThpTopTwenty({ date: date }));
  };

  const directionHandler = (start, end) => {
    console.log(start, end);
    const diff = (end * 100 - start * 100) / 100;
    let className = '';
    if (diff == 0) className = styles['notMoving'];
    if (diff > 0) className = styles['grow'];
    if (diff < 0) className = styles['drop'];
    return className;
  };

  return (
    <div>
      <button onClick={() => getThpTopTwentyHandler()}>取得該日前20名成交量</button>
      <input
        placeholder='YYYYMMDD'
        value={date}
        onChange={(e) => setDate(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            getThpTopTwentyHandler();
          }
        }}
      />
      {/* <div>{JSON.stringify(twenty)}</div> */}
      <div className={styles.info}>
        <table>
          <thead>
            <td>排名</td>
            <td>證卷代號</td>
            <td>證券名稱</td>
            <td>成交股數</td>
            <td>成交筆數</td>
            <td>開盤價</td>
            <td>最高價</td>
            <td>開低價</td>
            <td>收盤價</td>
            <td>漲跌價差</td>
            <td>開盤收盤價差</td>
          </thead>
          <tbody>
            {twenty?.map((item, idx) => (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>
                <td>{item[4]}</td>
                <td>{item[5]}</td>
                <td>{item[6]}</td>
                <td>{item[7]}</td>
                <td>{item[8]}</td>
                <td className={directionHandler(item[5], item[8])}>{item[10]}%</td>
                <td className={directionHandler(item[5], item[8])}>{(item[8] - item[5]).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default main;
