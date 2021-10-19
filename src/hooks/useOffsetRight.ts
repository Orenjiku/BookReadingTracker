import { useState, useEffect, RefObject } from 'react';


const useOffsetRight = (ref: RefObject<HTMLElement>, triggers: {[key: string]: boolean | number}): number => {
  const [offsetRight, setOffsetRight] = useState(0);

 //delay measuring offsetRight until flip transition to CardFront is completed.
  useEffect(() => {
    if (!ref.current) return;

    let delayTiming: ReturnType<typeof setTimeout>;
    if (!triggers.isFlipped) {
      delayTiming = setTimeout(() => {
        ref.current && setOffsetRight(ref.current.scrollWidth - ref.current.clientWidth);
      }, triggers.flipTimer as number * 1.5);  //added padding to timer to help ensure leftPosition measurement taken after card completely flipped.
    }

    return () => clearTimeout(delayTiming)
  }, [triggers.isFlipped]);

  return offsetRight;
}

export default useOffsetRight;