import { useState, useEffect, RefObject } from 'react';

interface useXStartReturnITF {
  leftPosition: number | null;
}

const useXStart = (ref: RefObject<HTMLElement>): useXStartReturnITF => {
  const [leftPosition, setLeftPosition] = useState<null | number>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current && setLeftPosition(ref.current.getBoundingClientRect().left);
  }, [ref]);

  return { leftPosition };
}

export default useXStart;