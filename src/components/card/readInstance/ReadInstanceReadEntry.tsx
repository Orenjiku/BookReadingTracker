import React, { memo } from 'react';
import tw, { styled } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../../interfaces/interface';
import ReadEntry from '../readEntry/ReadEntry';


interface ReadInstanceReadEntryPropsITF {
  readEntryList: ReadEntryITF[];
  readerBookId: number;
  readInstanceId: number;
  readEntryListAppendTimer: number;
  readEntrySelectTimer: number;
  isEdit: boolean;
  editTimer: number;
  handleReadEntrySelectToggle: Function;
  handleUpdateReaderBook: Function;
};

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

const ReadInstanceReadEntry = ({ readEntryList, readerBookId, readInstanceId, readEntryListAppendTimer, readEntrySelectTimer, isEdit, editTimer, handleReadEntrySelectToggle, handleUpdateReaderBook}: ReadInstanceReadEntryPropsITF) => (
  <TransitionGroup component={null}>
    {readEntryList.map(readEntry => (
      <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={readEntryListAppendTimer} classNames='slideFade' /* nodeRef={bookReadRef} */ >
        <ReadEntryContainer $readEntryListAppendTimer={readEntryListAppendTimer} /* ref={bookReadRef} */>
          <ReadEntry key={readEntry.re_id} readEntry={readEntry} readerBookId={readerBookId} readInstanceId={readInstanceId} isEdit={isEdit} editTimer={editTimer} readEntrySelectTimer={readEntrySelectTimer} handleReadEntrySelectToggle={(handleReadEntrySelectToggle)} handleUpdateReaderBook={handleUpdateReaderBook}/>
        </ReadEntryContainer>
      </CSSTransition>
    ))}
  </TransitionGroup>
);

export default memo(ReadInstanceReadEntry);