import React from 'react';
import { BookReadITF } from '../../interfaces/interface';
import ReadEntry from './ReadEntry';

interface BookReadPropsITF {
  bookRead: BookReadITF;
  totalPages: number;
}

const BookRead = ({ bookRead, totalPages } : BookReadPropsITF) => {
  return (
    <div className='h-full overflow-y-auto border border-red-100'>
      <div className='flex justify-between font-Charm-400'>
        <p className='text-sm'>Days Read: {bookRead.days_read}</p>
        <p className='text-sm'>Days Total: {bookRead.days_total}</p>
      </div>
      {
        bookRead.read_entry === undefined ?
        <div>Haven't started</div>
        :
        bookRead.read_entry.map(readEntry => {
          return <ReadEntry key={readEntry.re_id} readEntry={readEntry} totalPages={totalPages}/>
        })
      }
    </div>
  )
}

export default BookRead;