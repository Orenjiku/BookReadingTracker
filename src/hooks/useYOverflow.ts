import { useState, useEffect, RefObject } from "react";


interface useYOverflowPropsITF {
  scrollElementRef: RefObject<HTMLDivElement>;
  isExpanded: boolean;
  expandTimer: number;
  readEntrySelectToggle: boolean;
  readEntrySelectTimer: number;
  readEntryListLength: number;
  readEntryListAppendTimer: number
  isEdit: boolean;
}

interface useYOverflowReturnITF {
  refYOverflowing: boolean;
  refYScrollBegin: boolean;
  refYScrollEnd: boolean;
}

const useYOverflow = ({ scrollElementRef: ref, isExpanded, expandTimer, readEntryListLength, readEntryListAppendTimer, readEntrySelectToggle, readEntrySelectTimer, isEdit }: useYOverflowPropsITF): useYOverflowReturnITF => {
    const [refYOverflowing, setRefYOverflowing] = useState(false);
    const [refYScrollBegin, setRefYScrollBegin] = useState(true);
    const [refYScrollEnd, setRefYScrollEnd] = useState(false);

    useEffect(() => {
      if (!ref.current) return
      const isYOverflowing = ref.current.scrollHeight > ref.current.clientHeight;

      if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);

      const handleScroll = () => {
        const offsetBottom = ref?.current?.scrollHeight! - ref?.current?.clientHeight!;
        (ref?.current?.scrollTop! >= offsetBottom && refYScrollEnd === false) ? setRefYScrollEnd(true) : setRefYScrollEnd(false);
        (ref?.current?.scrollTop === 0) ? setRefYScrollBegin(true) : setRefYScrollBegin(false);
      }

      ref.current.addEventListener('scroll', handleScroll);

      return () => {
        ref.current?.removeEventListener('scroll', handleScroll);
      }
    }, []);

    //delay scroll height measurement until end of readInstance expand transition
    useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);
      }, expandTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [isExpanded]);

      //delay scroll height measurement until end of ReadEntry enter or exit transition
      useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);
      }, readEntryListAppendTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [readEntryListLength]);

      //delay scroll height measurement until end of isReadEntrySelected transition
      useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);
      }, readEntrySelectTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [readEntrySelectToggle]);

    //delay scroll height measurement in edge case: isExpand: true, isEdit: true, >= 8 readEntry with all Delete Containers open and then changing isEdit to false.
    useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        if (refYOverflowing !== isYOverflowing) setRefYOverflowing(isYOverflowing);
      }, readEntrySelectTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [isEdit]);

    return {refYOverflowing, refYScrollBegin, refYScrollEnd};
}

export default useYOverflow;