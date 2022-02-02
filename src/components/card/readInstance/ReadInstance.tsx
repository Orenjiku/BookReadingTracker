import React, { useState, useRef, useCallback } from 'react';
import { ReadInstanceITF } from '../../../interfaces/interface';
import useYOverflow from '../../../hooks/useYOverflow';
import ReadInstanceHeader from './ReadInstanceHeader';
import ReadInstanceReadEntry from './ReadInstanceReadEntry';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';


interface ReadInstancePropsITF {
  readInstance: ReadInstanceITF;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  handleIsExpanded: Function;
  handleUpdateReaderBook: Function;
};

const ReadInstance = ({ readInstance, isEdit, editTimer, isExpanded, expandTimer, handleIsExpanded, handleUpdateReaderBook } : ReadInstancePropsITF) => {
  const readEntryList = readInstance.read_entry || [];
  const [ readEntrySelectToggle, setReadEntrySelectToggle ] = useState(false); //triggers overflow check whenever readEntry is clicked.
  const readEntryListAppendTimer = 500;
  const readEntrySelectTimer = 300;

  // const bookReadRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overflowTriggers = {
    isExpanded,
    expandTimer,
    readEntryListLength: readEntryList.length,
    readEntryListAppendTimer,
    readEntrySelectToggle,
    readEntrySelectTimer,
    isEdit
  };
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow({scrollContainerRef, overflowTriggers});

  const handleReadEntrySelectToggle = useCallback(() => setReadEntrySelectToggle(readEntrySelectToggle => !readEntrySelectToggle), []);

  return (
    <div className='relative h-full w-full overflow-hidden'>

      <div ref={scrollContainerRef} className='h-full overflow-y-scroll scrollbar-hide'>

        <ReadInstanceHeader daysRead={readInstance.days_read} daysTotal={readInstance.days_total} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} />

        <ReadInstanceReadEntry readEntryList={readEntryList} readerBookId={readInstance.reader_book_id} readInstanceId={readInstance.ri_id} readEntryListAppendTimer={readEntryListAppendTimer} readEntrySelectTimer={readEntrySelectTimer } isEdit={isEdit} editTimer={editTimer} handleReadEntrySelectToggle={handleReadEntrySelectToggle} handleUpdateReaderBook={handleUpdateReaderBook} />

      </div>

      {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0' />}
      {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0' />}

    </div>
  )
};

export default ReadInstance;