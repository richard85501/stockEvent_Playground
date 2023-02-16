import { useEffect, useState } from 'react';

import {selectDealer,getDealerData,getThpTopTwenty } from '../store/slice/dealer';
import { useDispatch,useSelector } from 'react-redux';

const main = () => {
  const dispatch = useDispatch();
  const { twenty } = useSelector(selectDealer);

  useEffect(() => {
    dispatch(getThpTopTwenty());
  }, []);

  return (
    <div>
      <div>{JSON.stringify(twenty)}</div>
    </div>
  );
};

export default main;
