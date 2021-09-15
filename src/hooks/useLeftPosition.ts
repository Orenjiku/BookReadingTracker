import { useState, useEffect, RefObject } from 'react';

interface useXStartReturnITF {
  leftPosition: number | null;
}

const useXStart = (ref: RefObject<HTMLElement>): useXStartReturnITF => {
  const [leftPosition, setLeftPosition] = useState<null | number>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    let listenerTimeout: ReturnType<typeof setTimeout>;
    const resizeListener = () => {
      clearTimeout(listenerTimeout);
      listenerTimeout = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }, 150);
    }

    window.addEventListener('resize', resizeListener);
    ref.current && setLeftPosition(ref.current.getBoundingClientRect().left);
    return () => {
      window.removeEventListener('resize', resizeListener);
      // clearTimeout(listenerTimeout);
    }
  }, [ref, windowWidth, windowHeight]);

  return { leftPosition };
}

export default useXStart;