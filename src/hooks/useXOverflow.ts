import { useState, useEffect, RefObject } from 'react';

interface RefXITF {
  isRefXOverflowing: boolean;
  refOffsetRight: number;
}

const useXOverflow = (ref: RefObject<HTMLElement>): RefXITF => {
    const [isRefXOverflowing, setIsRefXOverflowing] = useState(false);
    const [refOffsetRight, setRefOffsetRight] = useState(0);

    useEffect(() => {
      if (!ref.current) return;
      const delayTiming = setTimeout(() => {
        if (ref.current && ref.current.scrollWidth > ref.current.clientWidth) {
          setIsRefXOverflowing(true);
          setRefOffsetRight(ref.current.scrollWidth - ref.current.clientWidth);
        }
      }, 1000);
      return () => { clearTimeout(delayTiming) };
    }, [ref]);

    return {isRefXOverflowing, refOffsetRight};
}

export default useXOverflow;