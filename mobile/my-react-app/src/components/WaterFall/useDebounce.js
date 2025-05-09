// src/components/Waterfall/useDebounce.js
import { useEffect, useRef } from 'react';

export default (callback, delay = 300) => {
  const timerRef = useRef();
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => savedCallback.current(...args), delay);
  };
};