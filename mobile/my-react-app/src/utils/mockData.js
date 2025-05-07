// src/utils/mockData.js
export const mockWaterfallData = (count) => {
    return Array(count).fill().map((_, i) => ({
      id: i,
      title: `游记标题#${i + 1}`,
      cover: `https://picsum.photos/300/200?random=${i}`,
      // 模拟10%的错误数据
      ...(i % 10 === 0 && { cover: 'invalid-url' })
    }));
  };