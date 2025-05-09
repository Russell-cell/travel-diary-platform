// src/components/Waterfall/index.jsx
import React from 'react';
import PropTypes from 'prop-types';
import VirtualList from './VirtualList';
import ErrorBoundary from './ErrorBoundary';
import { validateWaterfallData } from '../../utils/dataValidator';

const Waterfall = ({ data, searchHandler }) => {
  // 数据校验兜底
  const safeData = validateWaterfallData(data) || [];
  
  return (
    <ErrorBoundary fallback={<div className="error-fallback">组件加载失败</div>}>
      <div className="waterfall-container">
        <input
          type="text"
          placeholder="搜索游记..."
          onChange={(e) => searchHandler(e.target.value)}
        />
        <VirtualList data={safeData} />
      </div>
    </ErrorBoundary>
  );
};

Waterfall.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      cover: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  searchHandler: PropTypes.func.isRequired
};

export default Waterfall;