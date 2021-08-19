import React, { useRef } from 'react';
import { BookReadITF } from '../../interfaces/interface';
import useOverflow from '../../hooks/useOverflow';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ReadEntry from './ReadEntry';

interface BookReadPropsITF {
  bookRead: BookReadITF;
}

const BookRead = ({ bookRead } : BookReadPropsITF) => {

  const verticalRef = useRef(null);
  const {refYOverflowing, refYScrollBegin, refYScrollEnd} = useOverflow(verticalRef);

  return (
    <div id='view' className='relative h-full overflow-y-hidden'>
      <div ref={verticalRef} className='h-full overflow-y-scroll border border-red-100 scrollbar-hide'>
        <div className='flex justify-between font-Charm-400'>
          <p className='text-sm'>Days Read: {bookRead.days_read}</p>
          <p className='text-sm'>Days Total: {bookRead.days_total}</p>
        </div>
        <div>
          {
            bookRead.read_entry === undefined ?
            <div>Haven't started</div>
            :
            bookRead.read_entry.map(readEntry => {
              return <ReadEntry key={readEntry.re_id} readEntry={readEntry} />
            })
          }
        </div>
      </div>
      {refYOverflowing && !refYScrollBegin && <BsChevronUp className='absolute flex w-full top-0 justify-center' />}
      {refYOverflowing && !refYScrollEnd && <BsChevronDown className='absolute flex w-full bottom-0 justify-center' />}
      </div>
  )
}

export default BookRead;