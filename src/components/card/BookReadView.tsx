import React from 'react';
import { BookReadITF } from '../../interfaces/interface';
import BookRead from './BookRead';

interface BookReadViewPropsITF {
  bookRead: BookReadITF[];
  isUpdating: boolean;
}

const BookReadView = ({ bookRead, isUpdating }: BookReadViewPropsITF) => {
  return (
    <div className='row-start-10 row-end-17 col-start-2 col-end-3 font-SortsMillGoudy-400'>
          {bookRead.map(bookRead => {
              return <BookRead key={bookRead.br_id} bookRead={bookRead} isUpdating={isUpdating} />
            })
          }
    </div>
  )
}

export default BookReadView;