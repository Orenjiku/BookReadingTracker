import { useState, useEffect } from 'react';


const useHoldSubmit = (timer: number, submitFunction: Function): [ isStateSubmit: boolean, handleStartSubmit: Function, handleStopSubmit: Function ] => {
  const [ isStartSubmit, setIsStartSubmit ] = useState(false);

  let submitTimeout: ReturnType<typeof setTimeout>;
  useEffect(() => {
    if (isStartSubmit) {
      submitTimeout = setTimeout(() => {
        submitFunction();
        setIsStartSubmit(false);
      }, timer);
    }
    return () => clearTimeout(submitTimeout);
  }, [isStartSubmit]);

  const handleStartSubmit = () => setIsStartSubmit(true);

  const handleStopSubmit = () => {
    clearTimeout(submitTimeout);
    setIsStartSubmit(false);
  };

  return [ isStartSubmit, handleStartSubmit, handleStopSubmit ]
}

export default useHoldSubmit;