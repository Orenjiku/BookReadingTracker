import { useState, useEffect, RefObject } from "react";


interface useYOverflowITF {
  scrollContainerRef: RefObject<HTMLDivElement>;
  overflowTriggers: {
    isExpanded?: boolean;
    expandTimer?: number;
    readEntryListLength?: number;
    readEntryListAppendTimer?: number;
    readEntrySelectToggle?: boolean;
    readEntrySelectTimer?: number;
    isEdit?: boolean;
    newAuthorList?: string[];
    deleteAuthorList?: string[];
  };
}

interface useYOverflowReturnITF {
  refYOverflowing: boolean;
  refYScrollBegin: boolean;
  refYScrollEnd: boolean;
}

const useYOverflow = ({scrollContainerRef: ref, overflowTriggers}: useYOverflowITF): useYOverflowReturnITF => {
    const [refYOverflowing, setRefYOverflowing] = useState(false);
    const [refYScrollBegin, setRefYScrollBegin] = useState(true);
    const [refYScrollEnd, setRefYScrollEnd] = useState(false);

    useEffect(() => {
      if (!ref.current) return
      const isYOverflowing = ref.current.scrollHeight > ref.current.clientHeight;
      setRefYOverflowing(isYOverflowing);

      const handleScroll = () => {
        const offsetBottom = ref?.current?.scrollHeight! - ref?.current?.clientHeight!;
        (ref?.current?.scrollTop! >= offsetBottom && refYScrollEnd === false) ? setRefYScrollEnd(true) : setRefYScrollEnd(false);
        (ref?.current?.scrollTop === 0) ? setRefYScrollBegin(true) : setRefYScrollBegin(false);
      }

      ref.current.addEventListener('scroll', handleScroll);
      return () => ref.current?.removeEventListener('scroll', handleScroll);
    }, []);

    //delay scroll height measurement until end of readInstance expand transition
    useEffect(() => {
      //need to add extra time to handle cases where scrollHeight is almost the height of the clientHeight.
      const expandTimer = overflowTriggers.expandTimer ? overflowTriggers.expandTimer + 100 : 0;
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        setRefYOverflowing(isYOverflowing);
      }, expandTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [overflowTriggers.isExpanded]);

    //delay scroll height measurement until end of ReadEntry enter or exit transition
    useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        setRefYOverflowing(isYOverflowing);
    }, overflowTriggers.readEntryListAppendTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [overflowTriggers.readEntryListLength]);

    //delay scroll height measurement until end of isReadEntrySelected transition
    useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        setRefYOverflowing(isYOverflowing);
    }, overflowTriggers.readEntrySelectTimer);

    return () => clearTimeout(scrollHeightMeasureDelay);
  }, [overflowTriggers.readEntrySelectToggle]);

    //delay scroll height measurement in edge case: isExpand: true, isEdit: true, >= 8 readEntry with all Delete Containers open and then changing isEdit to false.
    useEffect(() => {
      const scrollHeightMeasureDelay = setTimeout(() => {
        const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
        setRefYOverflowing(isYOverflowing);
      }, overflowTriggers.readEntrySelectTimer);

      return () => clearTimeout(scrollHeightMeasureDelay);
    }, [overflowTriggers.isEdit]);

    //check overflow when adding or removing authors from CardBack.
    useEffect(() => {
      const isYOverflowing = ref.current && ref.current.scrollHeight > ref.current.clientHeight || false;
      setRefYOverflowing(isYOverflowing);
    }, [overflowTriggers.newAuthorList, overflowTriggers.deleteAuthorList])

    return { refYOverflowing, refYScrollBegin, refYScrollEnd };
}

export default useYOverflow;