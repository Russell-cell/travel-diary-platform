// src/pages/test/WaterfallTest.jsx
import React, { useState } from 'react';
import Waterfall from '../../components/WaterFall';
import { mockWaterfallData } from '../../utils/mockData';

export default () => {
  const [searchKey, setSearchKey] = useState('');
  
  // 模拟搜索处理
  const handleSearch = (keyword) => {
    console.log('Search triggered:', keyword);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>瀑布流组件测试</h1>
      <Waterfall 
        data={mockWaterfallData(1000)} 
        searchHandler={handleSearch}
      />
    </div>
  );
};