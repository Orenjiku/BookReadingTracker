import { useEffect, RefObject } from 'react';


const useIsXOverflow = (ref: RefObject<HTMLElement>, trigger: string | string[], handleIsOverflow: Function) => {

  useEffect(() => {
    if (!ref.current) return;

    const delayTiming = setTimeout(() => {
      ref.current && ref.current.scrollWidth > ref.current.clientWidth ? handleIsOverflow(true) : handleIsOverflow(false);
    }, 1000);

    return () => clearTimeout(delayTiming);
  }, [trigger]);

}

export default useIsXOverflow;