import React from 'react';
import { BookReadITF } from '../../interfaces/interface';
import BookRead from './BookRead';

interface BookReadViewPropsITF {
  bookRead: BookReadITF[];
}

const BookReadView = ({ bookRead }: BookReadViewPropsITF) => {
  return (
    <div className='row-start-10 row-end-17 col-start-2 col-end-3 font-SortsMillGoudy-400'>
          {bookRead.map(bookRead => {
              return <BookRead key={bookRead.br_id} bookRead={bookRead} />
            })
          }
    </div>
  )
}

export default BookReadView;