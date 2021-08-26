import React, { useState } from 'react';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import BookReadView from './BookReadView';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ArrowFromLeft } from '@styled-icons/boxicons-regular/ArrowFromLeft';

const Button = tw.button`
  font-AdventPro-200 text-sm border rounded w-max h-6 px-1.5 mx-1 flex justify-center items-center
`

const BlurbContainer = styled.div<{img?: string;}>`
  ${tw`relative col-start-1 col-end-3 row-start-4 row-end-19 flex justify-center items-center rounded-tl-2xl bg-trueGray-100 overflow-hidden`};
  &::before {
    content: '';
    background: url('${({ img }) => img}');
    ${tw`absolute w-full h-full bg-cover bg-center bg-no-repeat filter blur`};
  }
  &.blurbSlide-enter {
    transform: translateX(105%);
  };
  &.blurbSlide-enter-active {
    transform: translateX(0%);
    transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.blurbSlide-exit-active {
    transform: translateX(105%);
    transition: transform 800ms cubic-bezier(0.5, 0, 0.75, 0);
  };
`

const Card = ({ book }: { book: BookITF }) => {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);

  const handleUpdateProgress = () => {
    setIsUpdating(isUpdating => !isUpdating);
  }

  const handleShowDetails = () => {
    setIsShowingDetails(isShowingDetails => !isShowingDetails);
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
    <div style={{minWidth: '370px', maxWidth: '370px', minHeight: '370px', maxHeight: '370px'}} className='grid grid-cols-2 grid-rows-20 rounded-2xl shadow-xl mx-5 mb-10 bg-blueGray-200 select-none overflow-hidden'>

      <CardHeader title={book.title} author={book.author}/>
      <BookImage pictureLink={book.picture_link} />
      <DetailsView readDetails={readDetails} isUpdating={isUpdating} />
      <BookReadView bookReadList={book.book_read} isUpdating={isUpdating} />

      <div className='col-start-2 col-end-3 row-start-17 row-end-19 flex justify-center items-center bg-trueGray-50'>
        <Button className='bg-blueGray-300 text-trueGray-900' onClick={handleShowDetails}>Details</Button>
        <Button className='bg-blueGray-300 text-trueGray-900' onClick={handleUpdateProgress}>Update Progress</Button>
      </div>

      <div className='col-start-1 col-end-3 row-start-19 row-end-21 flex justify-center items-center rounded-b-2xl font-Charm-400 text-2xl text-trueGray-900'>
        Completed!
      </div>

      <CSSTransition in={isShowingDetails} timeout={800} classNames='blurbSlide' unmountOnExit>
        <BlurbContainer img={book.picture_link}>
          <ArrowFromLeft size={25} className='absolute top-0 left-0 cursor-pointer fill-current text-coolGray-50' onClick={handleShowDetails}/>
          <div className='bg-trueGray-50 h-4/6 w-5/6 z-10 overflow-y-scroll bg-opacity-60 p-3 whitespace-pre-wrap font-Helvetica text-xs rounded-tl-xl'>{book.blurb}</div>
        </BlurbContainer>
      </CSSTransition>

    </div>
  )
}

export default Card;