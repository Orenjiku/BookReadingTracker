import { useState, useEffect, RefObject } from "react";

interface RefYITF {
  refYOverflowing: boolean;
  refYScrollBegin: boolean;
  refYScrollEnd: boolean;
}

const useOverflow = (ref: RefObject<HTMLElement>): RefYITF => {
    const [refYOverflowing, setRefYOverflowing] = useState(false);
    const [refYScrollBegin, setRefYScrollBegin] = useState(true);
    const [refYScrollEnd, setRefYScrollEnd] = useState(false);

    useEffect(() => {
      if (!ref.current) return
      const isYOverflowing = ref.current.scrollHeight > ref.current.clientHeight;

      if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);

      const handleScroll = (): void => {
        const offsetBottom = ref?.current?.scrollHeight! - ref?.current?.clientHeight!;
        (ref?.current?.scrollTop! > offsetBottom && refYScrollEnd === false) ? setRefYScrollEnd(true) : setRefYScrollEnd(false);
        (ref?.current?.scrollTop === 0) ? setRefYScrollBegin(true) : setRefYScrollBegin(false);
      }

      ref.current.addEventListener('scroll', handleScroll);

      return () => ref.current?.removeEventListener('scroll', handleScroll);
    }, [ref?.current?.scrollHeight])

    return {refYOverflowing, refYScrollBegin, refYScrollEnd};
}

export default useOverflow;