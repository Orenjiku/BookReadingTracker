import React, { useState, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import ReaderBook from './ReaderBook';
import CompletionSlider from './CompletionSlider';
import { Edit } from '@styled-icons/boxicons-regular/Edit';

const CardFrontContainer = styled.div<{ $isFlipped: boolean }>`
  ${tw`absolute h-full w-full rounded-2xl grid grid-cols-2 grid-rows-21`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  ${tw`overflow-hidden select-none`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(0deg);
  transition: transform 600ms linear;
  ${({ $isFlipped }) => $isFlipped && css`
    transform: perspective(1200px) rotateY(-180deg);
  `};
`

const SlideContainer = styled.div<{ $src?: string }>`
  ${tw`relative col-start-1 col-end-3 row-start-4 row-end-20 rounded-tl-2xl flex justify-center items-center`};
  ${tw`bg-trueGray-100 overflow-hidden`};
  &::before {
    content: '';
    background: url('${({ $src }) => $src}');
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

const StyledEdit = styled(Edit)<{ $isEdit?: boolean }>`
  ${tw`absolute top-1.5 right-1 min-w-min opacity-50 stroke-1 stroke-current text-coolGray-50 cursor-pointer`};
  --edit-shadow: drop-shadow(0px 1px 0 black);
  filter: var(--edit-shadow);
  transition: all 100ms linear;
  ${({ $isEdit }) => $isEdit && css`
  --neon-light-center: #f9fafb;
  --neon-light-color: #0d9488;
  --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                  drop-shadow(0 0 6px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-center))
                  drop-shadow(0 0 12px var(--neon-light-center))
                  drop-shadow(0 0 16px var(--neon-light-color));
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: all 100ms linear;
    &:hover {
      animate: pulse 1s infinite;
      @keyframes pulse {
        0%, 100% {
          color: var(--neon-light-center);
          filter: var(--light-effect);
        }
        50% {
          color: var(--neon-light-center);
          filter: drop-shadow(0 0 1px var(--neon-light-center))
        }
      }
    }
  `}
`

const CardFront = ({ book, isFlipped, handleFlip }: { book: BookITF; isFlipped: boolean; handleFlip: Function }) => {

  const [ isEdit, setIsEdit ] = useState(false);
  const [ isSlideShow, setIsSlideShow ] = useState(false);
  // const [ isAnyReading, setIsAnyReading ] = useState<boolean>(book.reader_book.is_any_reading);
  // const [ isAnyFinished, setIsAnyFinished ] = useState<boolean>(book.reader_book.is_any_finished);
  // const [ currentReadInstanceIdx, setCurrentReadInstanceIdx ] = useState<number>(book.reader_book.read_instance.length - 1);
  const [ isReading, setIsReading ] = useState<boolean>(false);
  const [ isReaderBookExpanded, setIsReaderBookExpanded ] = useState(false)

  const cardFrontRef = useRef(null);

  const readInfo = book.reader_book;
  const pagesRead = readInfo.read_instance.reduce((acc, cur) => acc += cur.pages_read, 0);
  const totalDaysRead = readInfo.read_instance.reduce((acc, cur) => acc += cur.days_read, 0);
  const totalDays = readInfo.read_instance.reduce((acc, cur) => acc += cur.days_total, 0);
  const avgDailyRead = pagesRead > 0 ? Math.round(pagesRead / totalDaysRead) : 0;
  const maxDailyRead = Math.max(...readInfo.read_instance.reduce((acc, cur) => acc.concat(cur.max_daily_read), [] as number[]));
  const timesRead = readInfo.is_any_finished ? readInfo.read_instance.reduce((acc, cur) => acc += cur.is_finished ? 1 : 0, 0) : 0;

  // const [ readDetails, setReadDetails ] = useState({pagesRead, totalDays, totalDaysRead, avgDailyRead, maxDailyRead});
  const readDetails = [
    {key: 'Total Pages', value: book.total_pages},
    {key: 'Avg Daily Read', value: avgDailyRead},
    {key: 'Max Daily Read', value: maxDailyRead},
    {key: 'Total Days', value: totalDays},
    {key: 'Total Days Read', value: totalDaysRead},
    {key: 'Times Read', value: timesRead},
  ];

  const slideShowTimer = 800;

  //test variable for CompletionSlider based on first reader_book entry
  // const isReading = book.reader_book.is_any_reading;

  const handleEdit = () => setIsEdit(isEdit => !isEdit);
  const handleSlideShow = () => setIsSlideShow(isSlideShow => !isSlideShow);
  const handleIsReading = (isReading: boolean) => setIsReading(isReading);
  const handleIsReaderBookExpanded = () => setIsReaderBookExpanded(isReaderBookExpanded => !isReaderBookExpanded)

  return (
    <CardFrontContainer $isFlipped={isFlipped}>
      <CardHeader title={book.title} author={book.author} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleSlideShow={handleSlideShow} />
      <BookImage pictureLink={book.picture_link} isEdit={isEdit} handleFlip={handleFlip} />
      {isReaderBookExpanded ? null : <DetailsView isEdit={isEdit} readDetails={readDetails} />}
      <ReaderBook readerBook={book.reader_book} handleIsReading={handleIsReading} isReaderBookExpanded={isReaderBookExpanded} handleIsReaderBookExpanded={handleIsReaderBookExpanded} isEdit={isEdit} />

      <div className='col-start-1 col-end-3 row-start-20 row-end-22 flex justify-center items-center rounded-b-2xl text-trueGray-900 text-xl font-Charm-400 border-t border-trueGray-50'>
        {isReading && <CompletionSlider />}
      </div>

      <StyledEdit size={22} $isEdit={isEdit} onClick={() => handleEdit()} />

      <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='slide' nodeRef={cardFrontRef} unmountOnExit>
        <SlideContainer ref={cardFrontRef} $src={book.picture_link}>
          <div className='z-10 h-4/5 w-11/12 p-4 rounded-tl-2xl overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs font-Helvetica'>
            {book.blurb}
          </div>
        </SlideContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;