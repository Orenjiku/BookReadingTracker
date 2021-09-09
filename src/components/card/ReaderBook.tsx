import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import { ReaderBookITF, ReadEntryITF } from '../../interfaces/interface';
import ReadEntry from './ReadEntry';
import useOverflow from '../../hooks/useOverflow';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const StyledReadEntryContainer = styled.div`
  :last-child {
    ${tw`mb-2`}
  }
  &.readEntryAnimate-exit {
    opacity: 1;
    max-height: 52px;
  };
  &.readEntryAnimate-exit-active {
    opacity: 0;
    max-height: 0;
    transition: opacity 200ms ease-out, max-height 500ms ease-out;
  };
`

const ReaderBook = ({ readerBook, isEditing } : { readerBook: ReaderBookITF; isEditing: boolean }) => {
  const [readEntryList, setReadEntryList] = useState<ReadEntryITF[]>(readerBook.read_entry!)

  // const bookReadRef = useRef(null);
  const verticalScrollRef = useRef(null);
  const {refYOverflowing, refYScrollBegin, refYScrollEnd} = useOverflow(verticalScrollRef);

  const handleDeleteReadEntry = (readEntryId: number) => {
    //add fetch function to delete from database then update after transaction completed
    setReadEntryList(readEntryList.filter(readEntry => readEntry.re_id !== readEntryId));
  }

  return (
    <div className='relative h-full overflow-y-hidden'>
      <div ref={verticalScrollRef} className='h-full overflow-y-scroll scrollbar-hide'>
        <div className='flex justify-around font-Charm-400'>
          <p className='text-sm'>Days Read: {readerBook.days_read}</p>
          <p className='text-sm'>Days Total: {readerBook.days_total}</p>
        </div>

        <TransitionGroup component={null}>
          {readEntryList.map(readEntry => (
            <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={500} classNames='readEntryAnimate' /* nodeRef={bookReadRef} */ >
              <StyledReadEntryContainer /* ref={bookReadRef} */>
                <ReadEntry key={readEntry.re_id} readEntry={readEntry} isEditing={isEditing} handleDeleteReadEntry={handleDeleteReadEntry}/>
              </StyledReadEntryContainer>
            </CSSTransition>
          ))}
        </TransitionGroup>

      </div>
      {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0' />}
      {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0' />}
    </div>
  )
}

export default ReaderBook;