import React from 'react';
import { BookReadITF } from '../../interfaces/interface';
import BookRead from './BookRead';

interface BookReadViewPropsITF {
  bookRead: BookReadITF[];
  isUpdateProgress: boolean;
}

const BookReadView = ({ bookRead, isUpdateProgress }: BookReadViewPropsITF) => {
  return (
    <div className='row-start-10 row-end-17 col-start-2 col-end-3 font-SortsMillGoudy-400'>
          {bookRead.map(bookRead => {
              return <BookRead key={bookRead.br_id} bookRead={bookRead} isUpdateProgress={isUpdateProgress} />
            })
          }
    </div>
  )
}

export default BookReadView;