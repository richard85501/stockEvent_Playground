import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Strategy from './component/Strategy';
import Main from './component/Main';
import MainInfo from './component/MainInfo';
import RollerData from './component/RollerData';

const PlatForm = () => {
  return (
    <Routes>
      <Route>
        {/* <Route path='/' element={<Main />} /> */}
        <Route path='/main' element={<Main />} />
        <Route path='/strategy' element={<Strategy />} />
        <Route path='/MainInfo' element={<MainInfo />} />
        <Route path='/RollerData' element={<RollerData />} />
      </Route>
    </Routes>
  );
};

export default PlatForm;
