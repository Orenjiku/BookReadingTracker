import { useState, useEffect, RefObject } from 'react';

const useOffsetRight = (ref: RefObject<HTMLElement>): {offsetRight: number} => {
  const [offsetRight, setOffsetRight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    else setOffsetRight(ref.current.scrollWidth - ref.current.clientWidth);

  }, [ref.current?.scrollWidth, ref.current?.clientWidth]);

  return { offsetRight };
}

export default useOffsetRight;