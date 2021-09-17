import React, { useState, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import ReaderBookView from './ReaderBookView';

const CardFrontContainer = styled.div<{isFlipped: boolean}>`
  ${tw`absolute h-full w-full rounded-2xl grid grid-cols-2 grid-rows-20`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  ${tw`overflow-hidden select-none`};
  background: linear-gradient(#dbeafe 0, transparent 3%);
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(0deg);
  transition: transform 600ms linear;
  ${({ isFlipped }) => isFlipped && css`
    transform: perspective(1200px) rotateY(-180deg);
  `};
`

const SlideContainer = styled.div<{src?: string;}>`
  ${tw`relative col-start-1 col-end-3 row-start-4 row-end-19 rounded-tl-2xl flex justify-center items-center`};
  ${tw`bg-trueGray-100 overflow-hidden`};
  &::before {
    content: '';
    background: url('${({ src }) => src}');
    ${tw`absolute w-full h-full`}
    ${tw`bg-cover bg-center bg-no-repeat filter blur`};
  }
  &.slide-enter {
    transform: translateX(100%);
  };
  &.slide-enter-active {
    transform: translateX(0%);
    transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.slide-exit-active {
    transform: translateX(100%);
    transition: transform 800ms cubic-bezier(0.5, 0, 0.75, 0);
  };
`

const CardFront = ({ book, isFlipped, handleFlip }: { book: BookITF; isFlipped: boolean; handleFlip: Function }) => {

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isShowingSlide, setIsShowingSlide] = useState<boolean>(false);

  const cardFrontRef = useRef(null);

  const handleEdit = () => setIsEditing(isEditing => !isEditing);
  const handleShowSlide = () => setIsShowingSlide(isShowingSlide => !isShowingSlide);

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

      <CardHeader title={book.title} author={book.author} isShowingSlide={isShowingSlide} isEditing={isEditing} handleShowSlide={handleShowSlide} handleEdit={handleEdit} />
      <BookImage pictureLink={book.picture_link} isEditing={isEditing} handleFlip={handleFlip}/>
      <DetailsView readDetails={readDetails} />
      <ReaderBookView readerBookList={book.reader_book} isEditing={isEditing} />

      <div className='col-start-1 col-end-3 row-start-19 row-end-21 flex justify-center items-center text-trueGray-900 text-2xl font-Charm-400'>
        Completed!
      </div>

      <CSSTransition in={isShowingSlide} timeout={800} classNames='slide' nodeRef={cardFrontRef} unmountOnExit>
        <SlideContainer ref={cardFrontRef} src={book.picture_link}>
          <div className='z-10 h-4/5 w-11/12 p-4 rounded-tl-2xl overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs font-Helvetica'>
            {book.blurb}
          </div>
        </SlideContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;