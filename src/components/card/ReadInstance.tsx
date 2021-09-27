import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import { ReadInstanceITF, ReadEntryITF } from '../../interfaces/interface';
import ReadEntry from './ReadEntry';
import useIsYOverflow from '../../hooks/useIsYOverflow';
import useYOverflow from '../../hooks/useYOverflow';
import { BsChevronDown, BsChevronUp, BsChevronExpand } from 'react-icons/bs';
import { CgCalendarToday } from 'react-icons/cg';

const StyledReadEntryContainer = styled.div`
  :first-child {
    ${tw`pt-5`};
  };
  :last-child {
    ${tw`mb-2`};
  };
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

const ReadInstance = ({ readInstance, isEdit, handleIsReaderBookExpanded } : { readInstance: ReadInstanceITF; isEdit: boolean; handleIsReaderBookExpanded: Function }) => {
  const [ readEntryList, setReadEntryList ] = useState<ReadEntryITF[]>(readInstance.read_entry || []);

  // const bookReadRef = useRef(null);
  const verticalScrollRef = useRef(null);
  const { isRefYOverflowing } = useIsYOverflow(verticalScrollRef);
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow(verticalScrollRef);

  const handleDeleteReadEntry = (readEntryId: number) => {
    //add fetch function to delete from database then update after transaction completed
    setReadEntryList(readEntryList.filter(readEntry => readEntry.re_id !== readEntryId));
  }

  return (
    <div className='relative h-full overflow-hidden'>

      <div ref={verticalScrollRef} className='h-full overflow-y-scroll scrollbar-hide'>

        <div className='relative h-6 flex justify-evenly items-center font-Charm-400 text-sm'>
          <div className='flex items-center'>
            <p className='mr-0.5'>Read: {readInstance.days_read}</p>
            <CgCalendarToday />
          </div>
          <div className='flex items-center'>
            <p className='mr-0.5'>Total: {readInstance.days_total}</p>
            <CgCalendarToday />
          </div>
          {isRefYOverflowing &&
            <div className='absolute w-full flex justify-end cursor-pointer' onClick={() => handleIsReaderBookExpanded() }>
              <BsChevronExpand className='stroke-current' size={15} />
            </div>
          }
        </div>

        <TransitionGroup component={null}>
          {readEntryList.map(readEntry => (
            <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={500} classNames='readEntryAnimate' /* nodeRef={bookReadRef} */ >
              <StyledReadEntryContainer /* ref={bookReadRef} */>
                <ReadEntry key={readEntry.re_id} readEntry={readEntry} isEdit={isEdit} handleDeleteReadEntry={handleDeleteReadEntry}/>
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

export default ReadInstance;