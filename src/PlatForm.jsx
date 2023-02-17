import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Strategy from './component/Strategy';
import Main from './component/Main';

const PlatForm = () => {
  return (
    <Routes>
      <Route>
        <Route path='/strategy' element={<Strategy />} />
        <Route path='/main' element={<Main />} />
      </Route>
    </Routes>
  );
};

export default PlatForm;
