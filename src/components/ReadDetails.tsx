import React, { useState } from 'react';
import { BookReadITF } from '../interfaces/interface';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

interface ReadDetailsPropsITF {
  totalPages: number;
  bookRead: BookReadITF[];
}

const ReadDetails = ({ totalPages, bookRead }: ReadDetailsPropsITF) => {
  const [current, setCurrent] = useState<number>(0);

  const totalDays = bookRead.reduce((acc, cur) => acc + cur.days_total, 0);
  const totalDaysRead = bookRead.reduce((acc, cur) => acc + cur.days_read, 0);
  const avgDailyRead = Math.round(totalPages / totalDaysRead);

  const readDetails = [
    {key: 'Total Pages', value: totalPages},
    {key: 'Avg Daily Read', value: avgDailyRead},
    {key: 'Total Days', value: totalDays},
    {key: 'Total Days Read', value: totalDaysRead},
    // {key: 'Times Read', value: bookRead.length}
  ];

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='flex align-middle row-start-4 row-end-10 col-start-2 col-end-3 relative text-sm font-SortsMillGoudy-400 bg-trueGray-50 cursor-pointer'>
      <div className='relative flex h-full w-full justify-center items-center z-0'>
        <div className='absolute text-7.5xl text-blue-500 text-opacity-50 z-0'>{readDetails[current].value}</div>
        <div className='absolute font-AdventPro-400 text-2xl z-0'>{readDetails[current].key}</div>
      </div>
      <div className='absolute h-full left-0 w-6/12 z-50' onClick={prevSlide}>
        <BsChevronLeft className='absolute h-full left-0' />
      </div>
      <div className='absolute h-full right-0 w-6/12 z-50' onClick={nextSlide}>
        <BsChevronRight className='absolute h-full right-0' />
      </div>
    </div>
  )
}

export default ReadDetails;