import React from 'react';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsSlider from './DetailsSlider';
import BookRead from './BookRead';

const Card = ({ book }: { book: BookITF }) => {
  const totalDays = book.book_read.reduce((acc, cur) => acc + cur.days_total, 0);
  const totalDaysRead = book.book_read.reduce((acc, cur) => acc + cur.days_read, 0);
  const avgDailyRead = Math.round(book.total_pages / totalDaysRead);
  const timesRead = book.book_read.length;

  const readDetails = [
    {key: 'Total Pages', value: book.total_pages},
    {key: 'Avg Daily Read', value: avgDailyRead},
    {key: 'Total Days', value: totalDays},
    {key: 'Total Days Read', value: totalDaysRead},
    {key: 'Times Read', value: timesRead}
  ];

  return (
    <div style={{width: '370px', height: '370px'}} className='bg-blueGray-400 grid grid-cols-2 grid-rows-20 mb-10 rounded-2xl shadow-xl'>
      <CardHeader title={book.title} author={book.author}/>
      <BookImage pictureLink={book.picture_link} />
      <DetailsSlider readDetails={ readDetails } />
      <div className='row-start-10 row-end-17 col-start-2 col-end-3 font-SortsMillGoudy-400'>
        {book.book_read.map(bookRead => {
            return <BookRead key={bookRead.br_id} bookRead={bookRead} totalPages={book.total_pages}/>
          })
        }
      </div>
    </div>
  )
}

export default Card;