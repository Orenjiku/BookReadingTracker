import React, { useState } from 'react';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsSlider from './DetailsSlider';
import BookReadView from './BookReadView';
import tw from 'twin.macro';

const Button = tw.button`
  font-AdventPro-200 text-sm border rounded w-max h-6 px-1.5 mx-1 flex justify-center items-center
`

const Card = ({ book }: { book: BookITF }) => {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdateProgress = () => {
    setIsUpdating(isUpdating => !isUpdating);
  }

  const totalDays = book.book_read.reduce((acc, cur) => acc + cur.days_total, 0);
  const totalDaysRead = book.book_read.reduce((acc, cur) => acc + cur.days_read, 0);

  const dailyPagesRead = book.book_read.reduce((acc: number[], cur): number[] => {
    const pagesRead = cur.read_entry ? cur.read_entry.map(readEntry => readEntry.pages_read): [];
    return [...acc, ...pagesRead];
  }, []);
  const maxDailyRead = Math.max(...dailyPagesRead);

  const readDetails = [
    {key: 'Total Pages', value: book.total_pages},
    {key: 'Avg Daily Read', value: Math.round(book.total_pages / totalDaysRead)},
    {key: 'Max Daily Read', value: maxDailyRead},
    {key: 'Total Days', value: totalDays},
    {key: 'Total Days Read', value: totalDaysRead},
    {key: 'Times Read', value: book.book_read.length},
  ];

  return (
    <div style={{minWidth: '370px', maxWidth: '370px', minHeight: '370px', maxHeight: '370px'}} className='grid grid-cols-2 grid-rows-20 rounded-2xl shadow-xl mx-5 mb-10 bg-blueGray-200 select-none'>

      <CardHeader title={book.title} author={book.author}/>
      <BookImage pictureLink={book.picture_link} />
      <DetailsSlider readDetails={readDetails} isUpdating={isUpdating} />
      <BookReadView bookReadList={book.book_read} isUpdating={isUpdating} />

      <div className='col-start-2 col-end-3 row-start-17 row-end-19 flex justify-center items-center bg-trueGray-50'>
        <Button className='bg-blueGray-300 text-trueGray-900'>Edit</Button>
        <Button className='bg-blueGray-300 text-trueGray-900' onClick={handleUpdateProgress}>Update Progress</Button>
      </div>

      <div className='col-start-1 col-end-3 row-start-19 row-end-21 flex justify-center items-center rounded-b-2xl font-Charm-400 text-2xl text-trueGray-900'>
        Completed!
      </div>

    </div>
  )
}

export default Card;