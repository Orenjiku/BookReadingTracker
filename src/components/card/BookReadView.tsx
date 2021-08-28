import React from 'react';
import { BookReadITF } from '../../interfaces/interface';
import BookRead from './BookRead';

interface BookReadViewPropsITF {
  bookReadList: BookReadITF[];
  isUpdating: boolean;
}

const BookReadView = ({ bookReadList, isUpdating }: BookReadViewPropsITF) => {
  return (
    <div className='row-start-10 row-end-19 col-start-2 col-end-3 font-SortsMillGoudy-400'>
      {bookReadList.map(bookRead => (
        <BookRead key={bookRead.br_id} bookRead={bookRead} isUpdating={isUpdating} />
      ))}
    </div>
  )
}

export default BookReadView;