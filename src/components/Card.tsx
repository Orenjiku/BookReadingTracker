import React from 'react';
import { BookITF } from '../interfaces/interface';
import BookRead from './BookRead';
import CardHeader from './CardHeader';
import ReadDetails from './ReadDetails';
import BookImage from './BookImage';

const Card = ({ book }: { book: BookITF }) => {
  return (
    <div style={{width: '370px', height: '370px'}} className='bg-orange-400 grid grid-cols-2 grid-rows-20 mb-10 rounded-2xl shadow-xl'>
      <CardHeader title={book.title} author={book.author}/>
      <BookImage pictureLink={book.picture_link} />
      <ReadDetails totalPages={book.total_pages} bookRead={book.book_read}/>
      {/* <BookDetails totalDaysRead={totalDaysRead} totalDays={totalDays} totalPages={book.total_pages} timesRead={book.book_read!.length}/> */}
      <div className='row-start-10 row-end-17 col-start-2 col-end-3 font-SortsMillGoudy-400'>
        {book.book_read &&
          book.book_read.map(bookRead => {
            return <BookRead key={bookRead.br_id} bookRead={bookRead} totalPages={book.total_pages}/>
          })
        }
      </div>
    </div>
  )
}

export default Card;