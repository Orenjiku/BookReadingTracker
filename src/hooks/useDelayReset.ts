import { useEffect } from 'react';

const useDelayReset = (trigger: boolean, condition: boolean, timer: number, resetFunction: Function) => {
  useEffect(() => {
    let delayTimeout: ReturnType<typeof setTimeout>;
    if (trigger === condition) {
      delayTimeout = setTimeout(() => {
        resetFunction()
      }, timer);
    }
    () => clearTimeout(delayTimeout);
  }, [trigger]);
}

export default useDelayReset;