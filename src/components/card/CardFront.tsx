import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { BookDetailsITF, ReaderBookITF } from '../../interfaces/interface';
import useDelayFalse from '../../hooks/useDelayFalse';
import usePrevious from '../../hooks/usePrevious';
import BookImage from './BookImage';
import CardHeader from './cardHeader/CardHeader';
import CardViewer from './cardViewer/CardViewer';
import CardSlider from './cardSlider/CardSlider';
import CompletionSlider from './CompletionSlider';
import EditButton from './EditButton';
import ReaderBook from './ReaderBook';
import ReadInstance from './readInstance/ReadInstance';


interface CardFrontPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  readerBook: ReaderBookITF;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleFlip: Function;
  handleUpdateReaderBook: Function;
  handleUpdateBookList: Function;
}

const CardFrontContainer = styled.div<{ $isFlipped: boolean; $flipTimer: number }>`
  ${tw`absolute h-full w-full rounded-2xl`};
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

const CardFront = ({ bookDetails, author, readerBook, isFlipped, flipTimer, indicatorTransitionTimer, handleFlip, handleUpdateReaderBook, handleUpdateBookList }: CardFrontPropsITF) => {
  const [ readInstanceList, setReadInstanceList ] = useState(readerBook.read_instance);
  const [ readInstanceIdx, setReadInstanceIdx ] = useState(0);
  const prevReadInstanceLen = usePrevious(readInstanceList.length);

  const [ isEdit, setIsEdit ] = useState(false);
  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ isSlideShow, setIsSlideShow ] = useState(false);

  const editTimer = 300;
  const expandTimer = 300;
  const slideShowTimer = 800;

  //delay removing CardFront until flip is completed.
  const isShowDisplay = useDelayFalse(!isFlipped, flipTimer);

  useEffect(() => {
    //on first render, display most recent currently reading readInstance if any.
    const startIdx = readerBook.read_instance.length > 1 && readerBook.is_any_reading ? readerBook.read_instance.findIndex(readInstance => readInstance.is_reading === true) : 0;
    setReadInstanceIdx(startIdx);
  }, []);

  useEffect(() => {
    const readInstanceLen = readerBook.read_instance.length;
    if (readInstanceLen !== prevReadInstanceLen) {
      readInstanceLen < prevReadInstanceLen && readInstanceIdx > 0 ? setReadInstanceIdx(readInstanceIdx - 1) : 0;
      readInstanceLen > prevReadInstanceLen && setReadInstanceIdx(0);
    }
    setReadInstanceList(readerBook.read_instance);
  }, [readerBook]);

  const handleChangeReadInstanceIdx = (i: number) => setReadInstanceIdx(i);
  const handleIsEdit = () => setIsEdit(isEdit => !isEdit);
  const handleIsExpanded = () => setIsExpanded(isExpanded => !isExpanded);
  const handleShowSlideShow = () => setIsSlideShow(isSlideShow => !isSlideShow);

  return (
    <CardFrontContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>
      {isShowDisplay &&
        <div className='h-full w-full grid grid-cols-2 grid-rows-21'>
          <CardHeader title={bookDetails.title} author={author} isFlipped={isFlipped} flipTimer={flipTimer} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleShowSlideShow={handleShowSlideShow} />

          <EditButton isEdit={isEdit} editTimer={editTimer} handleIsEdit={handleIsEdit} />

          <BookImage bookId={bookDetails.b_id} bookCoverUrl={bookDetails.book_cover_url} category={bookDetails.category} isEdit={isEdit} editTimer={editTimer} handleFlip={handleFlip} handleUpdateBookList={handleUpdateBookList} />

          <div className='col-start-2 col-end-3 row-start-4 row-end-20 flex flex-col overflow-hidden'>
            <CardViewer bookDetails={bookDetails} readInstanceList={readInstanceList} readInstanceIdx={readInstanceIdx} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} isFlipped={isFlipped} flipTimer={flipTimer} indicatorTransitionTimer={indicatorTransitionTimer} handleUpdateReaderBook={handleUpdateReaderBook} />

            {readInstanceList.length <= 1
              ? <ReadInstance readInstance={readInstanceList[readInstanceIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleUpdateReaderBook={handleUpdateReaderBook}/>
              : <ReaderBook readInstanceList={readInstanceList} readInstanceIdx={readInstanceIdx} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleChangeReadInstanceIdx={handleChangeReadInstanceIdx} handleUpdateReaderBook={handleUpdateReaderBook}/>
            }
          </div>

          <div className='col-start-1 col-end-3 row-start-20 row-end-22'>
            <CompletionSlider readerBookId={readerBook.rb_id} readInstanceId={readInstanceList[readInstanceIdx].ri_id} totalPages={bookDetails.total_pages} isReading={readInstanceList[readInstanceIdx].is_reading} handleUpdateReaderBook={handleUpdateReaderBook} />
          </div>

          <CardSlider blurb={bookDetails.blurb} bookCoverUrl={bookDetails.book_cover_url} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} />
        </div>
      }
    </CardFrontContainer>
  )
}

export default CardFront;