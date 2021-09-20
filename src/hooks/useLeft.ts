import { useState, useEffect, RefObject } from 'react';

interface useXStartReturnITF {
  leftPosition: number;
}

const useLeft = (ref: RefObject<HTMLElement>): useXStartReturnITF => {
  const [leftPosition, setLeftPosition] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    ref.current && setLeftPosition(ref.current.getBoundingClientRect().left);

    let listenerTimeout: ReturnType<typeof setTimeout>;
    const resizeListener = () => {
      listenerTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    }

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      clearTimeout(listenerTimeout);
    }
  }, [windowWidth]);

  return { leftPosition };
}

export default useLeft;