// src/components/Waterfall/VirtualList.jsx
import React, { useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import SafeImage from './SafeImage';
import useWindowResize from '../../../../src/hooks/useWindowResize';

const VirtualList = ({ data = [] }) => {
  // 响应式容器高度
  const [listHeight] = useWindowResize(() => window.innerHeight - 100);

  const Row = useCallback(({ index, style }) => {
    const item = data[index] || {};
    return (
      <div style={{ ...style, padding: '10px' }}>
        <SafeImage 
          src={item.cover} 
          alt={item.title}
          fallback="/images/default-cover.jpg"
        />
        <h3 className="truncate">{item.title}</h3>
      </div>
    );
  }, [data]);

  return (
    <FixedSizeList
      height={listHeight}
      width="100%"
      itemSize={250}  // 固定高度方案
      itemCount={data.length}
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  );
};