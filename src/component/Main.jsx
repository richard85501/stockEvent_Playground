import { useEffect, useState } from 'react';

import { getDealerData, getEventList } from '../store/slice/dealer';
import { useDispatch, useSelector } from 'react-redux';

const main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEventList());
  }, []);

  return (
    <div>
      <div>main</div>
    </div>
  );
};

export default main;
