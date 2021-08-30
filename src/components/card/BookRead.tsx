import React, { useState, useRef } from 'react';
import { BookReadITF, ReadEntryITF } from '../../interfaces/interface';
import useOverflow from '../../hooks/useOverflow';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ReadEntry from './ReadEntry';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import tw, { styled } from 'twin.macro';

interface BookReadPropsITF {
  bookRead: BookReadITF;
  isUpdating: boolean;
}

const StyledAnimatedReadEntryContainer = styled.div`
  :last-child {
    ${tw`mb-2`}
  }
  &.readEntryAnimate-exit {
    opacity: 1;
    max-height: 50px;
  };
  &.readEntryAnimate-exit-active {
    opacity: 0;
    max-height: 0;
    transition: opacity 200ms ease-out, max-height 600ms ease-out;
  };
`

const BookRead = ({ bookRead, isUpdating } : BookReadPropsITF) => {
  const [readEntryList, setReadEntryList] = useState<ReadEntryITF[]>(bookRead.read_entry!)

  const verticalScrollRef = useRef(null);
  const {refYOverflowing, refYScrollBegin, refYScrollEnd} = useOverflow(verticalScrollRef);

  const handleDeleteReadEntry = (readEntryId: number) => {
    //add fetch function to delete from database then update after transaction completed
    setReadEntryList(readEntryList.filter(readEntry => readEntry.re_id !== readEntryId));
  }

  //Warning: findDOMNode is deprecated in StrictMode caused by CSSTransitionGroup unable to map nodeRef to a list of components. Adding nodeRef to TransitionGroup prevents CSSTransition animations on the listed components, but will clear the warning in console if desired for test purposes.
  // const bookReadRef = useRef(null);
  return (
    <div className='relative h-full overflow-y-hidden'>
      <div ref={verticalScrollRef} className='h-full overflow-y-scroll border scrollbar-hide'>
        <div className='flex justify-around font-Charm-400'>
          <p className='text-sm'>Days Read: {bookRead.days_read}</p>
          <p className='text-sm'>Days Total: {bookRead.days_total}</p>
        </div>

        <TransitionGroup component={null}>
          {readEntryList.map(readEntry => (
            <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={600} classNames='readEntryAnimate' /* nodeRef={bookReadRef} */ >
              <StyledAnimatedReadEntryContainer>
                <ReadEntry key={readEntry.re_id} readEntry={readEntry} isUpdating={isUpdating} handleDeleteReadEntry={handleDeleteReadEntry}/>
              </StyledAnimatedReadEntryContainer>
            </CSSTransition>
          ))}
        </TransitionGroup>

      </div>
      {!refYScrollBegin && <BsChevronUp className='absolute flex w-full top-0 justify-center' />}
      {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute flex w-full bottom-0 justify-center' />}
    </div>
  )
}

export default BookRead;