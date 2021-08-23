import React, { useState, useRef } from 'react';
import { BookReadITF, ReadEntryITF } from '../../interfaces/interface';
import useOverflow from '../../hooks/useOverflow';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ReadEntry from './ReadEntry';

interface BookReadPropsITF {
  bookRead: BookReadITF;
  isUpdateProgress: boolean;
}

const BookRead = ({ bookRead, isUpdateProgress } : BookReadPropsITF) => {
  const [readEntryList, setReadEntryList] = useState<ReadEntryITF[]>(bookRead.read_entry!)

  const handleDeleteReadEntry = (readEntryId: number) => {
    //add fetch function to delete from database then update after transaction completed
    setReadEntryList(readEntryList.filter(readEntry => readEntry.re_id !== readEntryId));
  }

  const verticalScrollRef = useRef(null);
  const {refYOverflowing, refYScrollBegin, refYScrollEnd} = useOverflow(verticalScrollRef);

  return (
    <div id='view' className='relative h-full overflow-y-hidden'>
      <div ref={verticalScrollRef} className='h-full overflow-y-scroll border scrollbar-hide'>
        <div className='flex justify-around font-Charm-400'>
          <p className='text-sm'>Days Read: {bookRead.days_read}</p>
          <p className='text-sm'>Days Total: {bookRead.days_total}</p>
        </div>
        <div>
          {
            bookRead.read_entry === undefined ?
            <div>Haven't started</div>
            :
            readEntryList.map(readEntry => {
              return <ReadEntry key={readEntry.re_id} readEntry={readEntry} handleDeleteReadEntry={handleDeleteReadEntry} isUpdateProgress={isUpdateProgress} />
            })
          }
        </div>
      </div>
      {!refYScrollBegin && <BsChevronUp className='absolute flex w-full top-0 justify-center' />}
      {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute flex w-full bottom-0 justify-center' />}
    </div>
  )
}

export default BookRead;