import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookDetailsITF, ReaderBookITF } from '../../interfaces/interface';
import BookImage from './BookImage';
import CardHeader from './CardHeader';
import CompletionSlider from './CompletionSlider';
import DetailsView from './DetailsView';
import EditView from './EditView'
import ReaderBook from './ReaderBook';
import ReadInstance from './ReadInstance';
import { Edit } from '@styled-icons/boxicons-regular/Edit';


interface CardFrontPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  readerBook: ReaderBookITF;
  isFlipped: boolean;
  flipTimer: number;
  handleFlip: Function;
  handleUpdateReaderBook: Function;
}

const CardFrontContainer = styled.div<{ $isFlipped: boolean; $flipTimer: number }>`
  ${tw`absolute h-full w-full rounded-2xl grid grid-cols-2 grid-rows-21`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  ${tw`overflow-hidden select-none`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(0deg);
  --flipDuration: ${({ $flipTimer }) => `${$flipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFlipped }) => $isFlipped && css`
    transform: perspective(1200px) rotateY(-180deg);
    pointer-events: none;
  `}
`;

const ViewExpandContainer = styled.div<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full overflow-hidden`};
  min-height: 38%;
  max-height: 38%;
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--expandDuration) ease-out;
  ${({ $isExpanded }) => $isExpanded && css`
    min-height: 0;
    max-height: 0;
    transition: all var(--expandDuration) ease-out calc(var(--expandDuration) * 0.5);
  `}
`;

const DetailsViewContainer = styled.div<{ $editTimer: number; $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full bg-blueGray-500 bg-opacity-40 `};
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all calc(var(--expandDuration) * 0.5) linear var(--expandDuration);
  ${({ $isExpanded }) => $isExpanded && css`
    ${tw`opacity-0`};
    transition: all calc(var(--expandDuration) * 0.5) linear;
  `}
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(100%);
  }
  &.slide-enter-active {
    transform: translateY(0);
    transition: transform var(--editDuration) linear;
  }
  &.slide-exit {
    transform: translateY(0);
  }
  &.slide-exit-active {
    transform: translateY(100%);
    transition: transform var(--editDuration) linear;
  }
`;

const EditViewContainer = styled.div<{ $isExpanded: boolean; $editTimer: number; $expandTimer: number }>`
  ${tw`absolute top-0 left-0 h-full w-full overflow-hidden`};
  -expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all calc(var(--expandDuration) * 0.5) linear var(--expandDuration);
  ${({ $isExpanded }) => $isExpanded && css`
    ${tw`opacity-0`};
    transition: all calc(var(--expandDuration) * 0.5) linear;
  `}
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: transform var(--editDuration) linear;
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: transform var(--editDuration) linear;
  }
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

const BlurbContainer = styled.div`
  ${tw`z-10 p-4 rounded-tl-2xl rounded-tr rounded-br overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs`};
  height: 85%;
  width: 90%;
  ::-webkit-scrollbar {
    ${tw`bg-trueGray-50 bg-opacity-60 w-2 rounded-r`};
  }
  ::-webkit-scrollbar-thumb {
    ${tw`bg-trueGray-400 bg-opacity-70 rounded-r`};
    &:hover {
      ${tw`bg-trueGray-500`};
    }
  }
`;

const StyledEditIcon = styled(Edit)<{ $isEdit: boolean, $editTimer: number }>`
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

const CardFront = ({ bookDetails, author, readerBook, isFlipped, flipTimer, handleFlip, handleUpdateReaderBook }: CardFrontPropsITF) => {
  const [ readInstanceList, setReadInstanceList ] = useState(readerBook.read_instance);
  const [ readInstanceIdx, setReadInstanceIdx ] = useState(0);

  const [ overallDaysRead, setOverallDaysRead ] = useState(0);
  const [ overallDaysTotal, setOverallDaysTotal ] = useState(0);
  const [ overallAvgDailyRead, setOverallAvgDailyRead ] = useState(0);
  const [ overallMaxDailyRead, setOverallMaxDailyRead ] = useState(0);
  const [ timesRead, setTimesRead ] = useState(0);

  const viewDetails = [
    {key: 'Total Pages', value: bookDetails.total_pages},
    {key: 'Max Daily Read', value: overallMaxDailyRead},
    {key: 'Avg Daily Read', value: overallAvgDailyRead},
    {key: 'Total Days Read', value: overallDaysRead},
    {key: 'Total Days', value: overallDaysTotal},
    {key: 'Times Read', value: timesRead}
  ];

  //transition conditions
  const detailsViewRef = useRef<HTMLDivElement>(null);
  const editViewRef = useRef<HTMLDivElement>(null);
  const slideShowRef = useRef<HTMLDivElement>(null);

  const [ isEdit, setIsEdit ] = useState(false);
  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ isSlideShow, setIsSlideShow ] = useState(false);

  const editTimer = 300;
  const expandTimer = 300;
  const slideShowTimer = 800;
  //---

  useEffect(() => {
    const startIdx = readerBook.read_instance.length > 1 && readerBook.is_any_reading ? readerBook.read_instance.findIndex(readInstance => readInstance.is_reading === true) : 0;
    setReadInstanceIdx(startIdx);
  }, [])

  useEffect(() => {
    const overallPagesRead = readInstanceList.reduce((acc, cur) => acc + cur.pages_read, 0);
    const updatedOverallDaysRead = readInstanceList.reduce((acc, cur) => acc + cur.days_read, 0);
    setOverallDaysRead(updatedOverallDaysRead);
    setOverallAvgDailyRead(updatedOverallDaysRead > 0 ? Math.round(overallPagesRead / updatedOverallDaysRead) : 0);
    setOverallDaysTotal(readInstanceList.reduce((acc, cur) => acc + cur.days_total, 0));
    setTimesRead(readerBook.is_any_finished ? readInstanceList.reduce((acc, cur) => acc += cur.is_finished ? 1 : 0, 0) : 0);
    setReadInstanceList(readerBook.read_instance);
  }, [readerBook]);

  useEffect(() => {
    setOverallMaxDailyRead(Math.max(...readInstanceList.map(readInstance => readInstance.max_daily_read)));
  }, [readInstanceList]);

  const handleChangeReadInstanceIdx = (i: number) => setReadInstanceIdx(i);
  const handleIsEdit = () => setIsEdit(isEdit => !isEdit);
  const handleIsExpanded = () => setIsExpanded(isExpanded => !isExpanded);
  const handleShowSlideShow = () => setIsSlideShow(isSlideShow => !isSlideShow);

  return (
    <CardFrontContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>

      <CardHeader title={bookDetails.title} author={author} isFlipped={isFlipped} flipTimer={flipTimer} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleShowSlideShow={handleShowSlideShow} />

      <StyledEditIcon size={22} $isEdit={isEdit} $editTimer={editTimer} onClick={() => handleIsEdit()} />

      <BookImage bookCoverUrl={bookDetails.book_cover_url} isEdit={isEdit} editTimer={editTimer} handleFlip={handleFlip} />

      <div className='col-start-2 col-end-3 row-start-4 row-end-20 flex flex-col overflow-hidden'>
        <ViewExpandContainer $isExpanded={isExpanded} $expandTimer={expandTimer}>

          <CSSTransition in={!isEdit} timeout={editTimer} classNames='slide' nodeRef={detailsViewRef} unmountOnExit>
            <DetailsViewContainer ref={detailsViewRef} $editTimer={editTimer} $isExpanded={isExpanded} $expandTimer={expandTimer}>
              <DetailsView viewDetails={viewDetails} />
            </DetailsViewContainer>
          </CSSTransition>

          <CSSTransition in={isEdit} timeout={editTimer} classNames='slide' nodeRef={editViewRef} unmountOnExit>
            <EditViewContainer ref={editViewRef} $editTimer={editTimer} $isExpanded={isExpanded} $expandTimer={expandTimer}>
              <EditView readerBookId={readInstanceList[readInstanceIdx].reader_book_id} readInstanceId={readInstanceList[readInstanceIdx].ri_id} totalPages={bookDetails.total_pages} isEdit={isEdit} handleUpdateReaderBook={handleUpdateReaderBook} />
            </EditViewContainer>
          </CSSTransition>

        </ViewExpandContainer>

        {readInstanceList.length <= 1
          ? <ReadInstance readInstance={readInstanceList[readInstanceIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleUpdateReaderBook={handleUpdateReaderBook}/>
          : <ReaderBook readInstanceList={readInstanceList} readInstanceIdx={readInstanceIdx} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleChangeReadInstanceIdx={handleChangeReadInstanceIdx} handleUpdateReaderBook={handleUpdateReaderBook}/>
        }
      </div>

      <div className='col-start-1 col-end-3 row-start-20 row-end-22'>
        <CompletionSlider readerBookId={readerBook.rb_id} readInstanceId={readInstanceList[readInstanceIdx].ri_id} totalPages={bookDetails.total_pages} isReading={readInstanceList[readInstanceIdx].is_reading} handleUpdateReaderBook={handleUpdateReaderBook} />
      </div>

      <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='slide' nodeRef={slideShowRef} unmountOnExit>
        <SlideShowContainer ref={slideShowRef} $src={bookDetails.book_cover_url} $slideShowTimer={slideShowTimer}>
          <BlurbContainer>
            {bookDetails.blurb}
          </BlurbContainer>
        </SlideShowContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;