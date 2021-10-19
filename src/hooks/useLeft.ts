import { useState, useEffect, RefObject } from 'react';


const useLeft = (ref: RefObject<HTMLElement>, triggers: {[key: string]: boolean | number}): number => {
  const [leftPosition, setLeftPosition] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState(0);

 //delay measuring leftPosition until flip transition to CardFront is completed.
  useEffect(() => {
    if (!ref.current) return;

    let delayTiming: ReturnType<typeof setTimeout>;
    if (!triggers.isFlipped) {
      delayTiming = setTimeout(() => {
        ref.current && setLeftPosition(ref.current.getBoundingClientRect().left);
      }, triggers.flipTimer as number * 1.5); //added padding to timer to help ensure leftPosition measurement taken after card completely flipped.
    }

    return () => clearTimeout(delayTiming);
  }, [triggers.isFlipped]);

  //measure leftPosition whenever the windowWidth changes
  useEffect(() => {
    if (!ref.current) return;

    ref.current && setLeftPosition(ref.current.getBoundingClientRect().left);

    let listenerTimeout: ReturnType<typeof setTimeout>;
    const resizeListener = () => {
      listenerTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150); //delay changing windowWidth state to reduce number of state changes to leftPosition.
    }

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      clearTimeout(listenerTimeout);
    }
  }, [windowWidth]);

  return leftPosition;
}

export default useLeft;