import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadInstanceITF } from '../../../interfaces/interface';
import useYOverflow from '../../../hooks/useYOverflow';
import ReadInstanceHeader from './ReadInstanceHeader';
import ReadEntry from '../readEntry/ReadEntry';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';


interface ReadInstancePropsITF {
  readInstance: ReadInstanceITF;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  handleIsExpanded: Function;
  handleUpdateReaderBook: Function;
}

const ReadEntryContainer = styled.div<{ $readEntryListAppendTimer: number }>`
  &:nth-child(2) {
    ${tw`mt-1`};
  }
  &:last-child {
    ${tw`mb-2`};
  }
  --duration: ${({ $readEntryListAppendTimer }) => `${$readEntryListAppendTimer}ms`};
  &.slideFade-enter {
    opacity: 0;
    max-height: 0;
  }
  &.slideFade-enter-active {
    opacity: 1;
    max-height: 52px;
    transition: opacity calc(var(--duration) * 0.4) ease-out, max-height var(--duration) ease-out;
  }
  &.slideFade-exit {
    opacity: 1;
    max-height: 52px;
  }
  &.slideFade-exit-active {
    opacity: 0;
    max-height: 0;
    transition: opacity calc(var(--duration) * 0.4) ease-out, max-height var(--duration) ease-out;
  }
`;

const ReadInstance = ({ readInstance, isEdit, editTimer, isExpanded, expandTimer, handleIsExpanded, handleUpdateReaderBook } : ReadInstancePropsITF) => {
  const readEntryList = readInstance.read_entry || [];
  const [ readEntrySelectToggle, setReadEntrySelectToggle ] = useState(false); //triggers overflow check whenever readEntry is clicked.
  const readEntryListAppendTimer = 500;
  const readEntrySelectTimer = 300;

  // const bookReadRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overflowTriggers = {
    isExpanded,
    expandTimer,
    readEntryListLength: readEntryList.length,
    readEntryListAppendTimer,
    readEntrySelectToggle,
    readEntrySelectTimer,
    isEdit
  };
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow({scrollContainerRef, overflowTriggers});

  const handleReadEntrySelectToggle = () => setReadEntrySelectToggle(readEntrySelectToggle => !readEntrySelectToggle);

  return (
    <div className='relative h-full w-full overflow-hidden'>

      <div ref={scrollContainerRef} className='h-full overflow-y-scroll scrollbar-hide'>

        <ReadInstanceHeader daysRead={readInstance.days_read} daysTotal={readInstance.days_total} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} />

        <TransitionGroup component={null}>
          {readEntryList.map(readEntry => (
            <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={readEntryListAppendTimer} classNames='slideFade' /* nodeRef={bookReadRef} */ >
              <ReadEntryContainer $readEntryListAppendTimer={readEntryListAppendTimer} /* ref={bookReadRef} */>
                <ReadEntry key={readEntry.re_id} readEntry={readEntry} readerBookId={readInstance.reader_book_id} readInstanceId={readInstance.ri_id} isEdit={isEdit} editTimer={editTimer} readEntrySelectTimer={readEntrySelectTimer} handleReadEntrySelectToggle={(handleReadEntrySelectToggle)} handleUpdateReaderBook={handleUpdateReaderBook}/>
              </ReadEntryContainer>
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