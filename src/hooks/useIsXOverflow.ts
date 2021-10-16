import { useState, useEffect, RefObject } from 'react';


const useIsXOverflow = (ref: RefObject<HTMLElement>, trigger: string | string[]): {isRefXOverflowing: boolean} => {
  const [isRefXOverflowing, setIsRefXOverflowing] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const delayTiming = setTimeout(() => {
      if (ref.current && ref.current.scrollWidth > ref.current.clientWidth) {
        setIsRefXOverflowing(true);
      }
    }, 1000);

    return () => { clearTimeout(delayTiming) };
  }, []);

  useEffect(() => {
    ref.current && ref.current.scrollWidth > ref.current.clientWidth ? setIsRefXOverflowing(true) : setIsRefXOverflowing(false);
  }, [trigger])

  return {isRefXOverflowing};
}

export default useIsXOverflow;