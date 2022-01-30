import { useState, useEffect } from 'react';

const useDelayFalse = (trigger: boolean, timer: number) => {

  const [ isShowDisplay, setIsShowDisplay ] = useState(false);

  let delayFalseTimeout: ReturnType<typeof setTimeout>;
  useEffect(() => {
    trigger ? setIsShowDisplay(true) : delayFalseTimeout = setTimeout(() => setIsShowDisplay(false), timer);
    return () => clearTimeout(delayFalseTimeout);
  }, [trigger]);

  return isShowDisplay;
}

export default useDelayFalse;