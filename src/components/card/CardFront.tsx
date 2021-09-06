import React, { useState, useRef } from 'react';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import ReaderBookView from './ReaderBookView';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

const CardFrontContainer = styled.div<{isFlipped: boolean}>`
  ${tw`absolute h-full w-full grid grid-cols-2 grid-rows-20 rounded-2xl shadow-xl bg-blueGray-200 overflow-hidden select-none`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(0deg);
  transition: transform 600ms linear;
  ${({ isFlipped }) => isFlipped && css`
    transform: perspective(1200px) rotateY(-180deg);
  `}
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

const CardFront = ({ book, isFlipped, handleFlip }: { book: BookITF; isFlipped: boolean; handleFlip: Function }) => {

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);

  const cardRef = useRef(null);

  const handleUpdateProgress = () => {
    setIsUpdating(isUpdating => !isUpdating);
  }

  const handleShowDetails = () => {
    setIsShowingDetails(isShowingDetails => !isShowingDetails);
  }

  const totalDays = book.reader_book.reduce((acc, cur) => acc + cur.days_total, 0);
  const totalDaysRead = book.reader_book.reduce((acc, cur) => acc + cur.days_read, 0);

  const dailyPagesRead = book.reader_book.reduce((acc: number[], cur): number[] => {
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
    {key: 'Times Read', value: book.reader_book.length},
  ];

  return (
    <CardFrontContainer isFlipped={isFlipped}>

      <CardHeader title={book.title} author={book.author} isShowingDetails={isShowingDetails} isUpdating={isUpdating} handleShowDetails={handleShowDetails} handleUpdateProgress={handleUpdateProgress} />
      <BookImage pictureLink={book.picture_link} isUpdating={isUpdating} handleFlip={handleFlip}/>
      <DetailsView readDetails={readDetails} />
      <ReaderBookView readerBookList={book.reader_book} isUpdating={isUpdating} />

      <div className='col-start-1 col-end-3 row-start-19 row-end-21 flex justify-center items-center font-Charm-400 text-2xl text-trueGray-900 bg-blueGray-300'>
        Completed!
      </div>

      <CSSTransition in={isShowingDetails} timeout={800} classNames='blurbSlide' nodeRef={cardRef} unmountOnExit>
        <BlurbContainer ref={cardRef} img={book.picture_link}>
          <div className='bg-trueGray-50 h-4/6 w-5/6 z-10 overflow-y-scroll bg-opacity-60 p-3 whitespace-pre-wrap font-Helvetica text-xs rounded-tl-2xl'>
            {book.blurb}
          </div>
        </BlurbContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;