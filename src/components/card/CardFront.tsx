import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import ReaderBook from './ReaderBook';
import ReadInstance from './ReadInstance';
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
  `}
`;

const SlideShowContainer = styled.div<{ $src?: string; $slideShowTimer: number }>`
  ${tw`relative col-start-1 col-end-3 row-start-4 row-end-20 rounded-tl-2xl flex justify-center items-center`};
  ${tw`bg-trueGray-100 overflow-hidden`};
  --duration: ${({ $slideShowTimer }) => `${$slideShowTimer}ms`};
  &::before {
    content: '';
    background: url('${({ $src }) => $src}');
    ${tw`absolute w-full h-full`};
    ${tw`bg-cover bg-center bg-no-repeat filter blur`};
  }
  &.slide-enter {
    transform: translateX(100%);
  }
  &.slide-enter-active {
    transform: translateX(0%);
    transition: transform var(--duration) cubic-bezier(0.22, 1, 0.36, 1);
  }
  &.slide-exit-active {
    transform: translateX(100%);
    transition: transform var(--duration) cubic-bezier(0.5, 0, 0.75, 0);
  }
`;

const StyledEdit = styled(Edit)<{ $isEdit: boolean, $editTimer: number }>`
  ${tw`absolute top-1.5 right-1 min-w-min opacity-50 stroke-1 stroke-current text-coolGray-50 cursor-pointer`};
  filter: drop-shadow(0px 1px 0 black);
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: all var(--duration) linear;
  ${({ $isEdit }) => !$isEdit && css`
    &:hover {
      ${tw`opacity-70`};
    }
  `}
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
    transition: all var(--duration) linear;
  `}
`;

const CardFront = ({ book, isFlipped, handleFlip }: { book: BookITF; isFlipped: boolean; handleFlip: Function }) => {

  const [ isEdit, setIsEdit ] = useState(false);
  const [ isSlideShow, setIsSlideShow ] = useState(false);
  const [ isReading, setIsReading ] = useState<boolean>(false);
  const [ isExpanded, setIsExpanded ] = useState(false);

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

  useEffect(() => {
    if (book.reader_book.read_instance.length === 1) {
      setIsReading(book.reader_book.is_any_reading);
    }
  }, []);

  const slideShowTimer = 800;
  const expandTimer = 400;
  const editTimer = 300;

  const handleIsEdit = () => setIsEdit(isEdit => !isEdit);
  const handleIsSlideShow = () => setIsSlideShow(isSlideShow => !isSlideShow);
  const handleIsReading = (isReading: boolean) => setIsReading(isReading);
  const handleIsExpanded = () => setIsExpanded(isExpanded => !isExpanded);

  return (
    <CardFrontContainer $isFlipped={isFlipped}>

      <CardHeader title={book.title} author={book.author} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleIsSlideShow={handleIsSlideShow} />

      <BookImage pictureLink={book.picture_link} isEdit={isEdit} editTimer={editTimer} handleFlip={handleFlip} />

      <div className='col-start-2 col-end-3 row-start-4 row-end-20 flex flex-col overflow-hidden'>
        <DetailsView readDetails={readDetails} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} />
        {book.reader_book.read_instance.length === 1
          ? <ReadInstance readInstance={book.reader_book.read_instance[0]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} />
          : <ReaderBook readerBook={book.reader_book} isEdit={isEdit} editTimer={editTimer} handleIsReading={handleIsReading} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} />
        }
      </div>

      <div className='col-start-1 col-end-3 row-start-20 row-end-22'>
        <CompletionSlider isReading={isReading} />
      </div>

      <StyledEdit size={22} $isEdit={isEdit} $editTimer={editTimer} onClick={() => handleIsEdit()} />

      <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='slide' nodeRef={cardFrontRef} unmountOnExit>
        <SlideShowContainer ref={cardFrontRef} $src={book.picture_link} $slideShowTimer={slideShowTimer}>
          <div className='z-10 h-4/5 w-11/12 p-4 rounded-tl-2xl overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs font-Helvetica'>
            {book.blurb}
          </div>
        </SlideShowContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;