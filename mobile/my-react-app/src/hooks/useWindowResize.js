// src/hooks/useWindowResize.js
import { useState, useEffect } from 'react';

export default (callback) => {
  const [value, setValue] = useState(callback);

  useEffect(() => {
    const handler = () => setValue(callback());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [callback]);

  return [value];
};