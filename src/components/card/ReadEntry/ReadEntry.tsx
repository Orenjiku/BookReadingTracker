import React, { useState, useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../../interfaces/interface';
import ReadEntryBar from './ReadEntryBar';
import ReadEntryDeleteBar from './ReadEntryDeleteBar';


interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  readerBookId: number;
  readInstanceId: number;
  isEdit: boolean;
  editTimer: number;
  readEntrySelectTimer: number;
  handleReadEntrySelectToggle: Function;
  handleUpdateReaderBook: Function;
};

const DeleteBarContainer = styled.div<{ $readEntrySelectTimer: number }>`
  ${tw`flex justify-center p-0 mb-0 overflow-y-hidden`};
  --duration: ${({ $readEntrySelectTimer }) => `${$readEntrySelectTimer}ms`};
  &.slide-enter {
    max-height: 0;
  }
  &.slide-enter-active {
    max-height: 26px;
    transition: all var(--duration) ease-out;
  }
  &.slide-exit {
    max-height: 26px;
    opacity: 1;
  }
  &.slide-exit-active {
    max-height: 0;
    transition: all var(--duration) ease-out;
  }
`;

const ReadEntry = ({ readEntry, readerBookId, readInstanceId, isEdit, editTimer, readEntrySelectTimer, handleReadEntrySelectToggle, handleUpdateReaderBook }: ReadEntryPropsITF) => {
  const [ isEntrySelected, setIsEntrySelected ] = useState<boolean>(false);

  const readEntryDeleteRef = useRef(null);

  useEffect(() => {
    !isEdit && setIsEntrySelected(false);
  }, [isEdit]);

  const handleEntrySelect = () => isEdit && setIsEntrySelected(isEntrySelected => !isEntrySelected);

  return (
    <div>
      <ReadEntryBar readEntry={readEntry} isEdit={isEdit} editTimer={editTimer} handleEntrySelect={handleEntrySelect} handleReadEntrySelectToggle={handleReadEntrySelectToggle} />

      <CSSTransition in={isEdit && isEntrySelected} timeout={readEntrySelectTimer} classNames='slide' nodeRef={readEntryDeleteRef} unmountOnExit>
        <DeleteBarContainer ref={readEntryDeleteRef} $readEntrySelectTimer={readEntrySelectTimer}>
          <ReadEntryDeleteBar readerBookId={readerBookId} readInstanceId={readInstanceId} readEntryId={readEntry.re_id} pagesRead={readEntry.pages_read} isEntrySelected={isEntrySelected} handleUpdateReaderBook={handleUpdateReaderBook} />
        </DeleteBarContainer>
      </CSSTransition>
    </div>
  )
};

export default ReadEntry;