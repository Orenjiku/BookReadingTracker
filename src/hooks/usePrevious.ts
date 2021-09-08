import { useEffect, useRef } from 'react';

const usePrevious = (value: number): number => {
  const ref = useRef<number>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;