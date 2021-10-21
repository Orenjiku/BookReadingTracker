import React, { useState, useEffect, useRef } from 'react';
import tw, {styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';
import { Trash } from '@styled-icons/bootstrap/Trash';


interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  isEdit: boolean;
  editTimer: number;
  readEntrySelectTimer: number;
  handleToggle: Function;
  handleDeleteReadEntry: Function;
}

const EntryBar = styled.div<{ $before: string; $after: number }>`
  ${tw`relative px-0.5 flex justify-center`};
  ${tw`text-trueGray-900 text-xs font-SortsMillGoudy-400`};
  &::before {
    content: '${({ $before }) => $before}';
    ${tw`absolute left-0`};
  }
  &::after {
    content: '${({ $after }) => `+${$after} pgs`}';
    ${tw`absolute right-0 text-green-600`};
  }
`;

const DeleteContainer = styled.div<{ $readEntrySelectTimer: number }>`
  ${tw`flex justify-center items-end p-0 mb-0 overflow-y-hidden`};
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

const DeleteButton = styled.button<{ $isMouseDown: boolean }>`
  ${tw`px-1.5 mx-1 rounded flex justify-center items-center`};
  ${tw`bg-red-400 text-trueGray-50 text-sm font-AdventPro-200`};
  height: 26px;
  ${tw`transition-colors duration-200 ease-linear`};
  ${({ $isMouseDown }) => $isMouseDown && css`
    ${tw`bg-red-500 transition-colors duration-1000 ease-linear`};
  `}
`;

const ReadEntry = ({ readEntry, isEdit, editTimer, readEntrySelectTimer, handleToggle, handleDeleteReadEntry }: ReadEntryPropsITF) => {
  const [ isEntrySelected, setIsEntrySelected ] = useState<boolean>(false);
  const [ isMouseDown, setIsMouseDown ] = useState<boolean>(false);

  const readEntryDeleteRef = useRef(null);
  const entryDate = new Date(readEntry.date_read).toLocaleDateString();
  const currentPercent = Number(readEntry.current_percent.toFixed(0));

  let deleteTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (isMouseDown) {
      deleteTimeout = setTimeout(() => {
        handleDeleteReadEntry(readEntry);
        setIsMouseDown(false);
      }, 1000);
    }
    return () => clearTimeout(deleteTimeout);
  }, [isMouseDown]);

  useEffect(() => {
    !isEdit && setIsEntrySelected(false);
  }, [isEdit]);


  useEffect(() => {
    handleToggle();
  }, [isEntrySelected]);

  const handleEntrySelect = () => isEdit && setIsEntrySelected(isEntrySelected => !isEntrySelected);

  const handleStartDelete = () => setIsMouseDown(true);

  const handleStopDelete = () => {
    clearTimeout(deleteTimeout);
    setIsMouseDown(false);
  };

  return (
    <div>

      <div className={`relative px-1 pb-0.5 ${isEdit && 'cursor-pointer hover:bg-blueGray-300 hover:bg-opacity-50'}`} onClick={handleEntrySelect}>
        <EntryBar $before={entryDate} $after={readEntry.pages_read}>{`${currentPercent}%`}</EntryBar>
        <ProgressBar isEdit={isEdit} editTimer={editTimer} currentPercent={currentPercent} />
      </div>

      <CSSTransition in={isEdit && isEntrySelected} timeout={readEntrySelectTimer} classNames='slide' nodeRef={readEntryDeleteRef} unmountOnExit>
        <DeleteContainer ref={readEntryDeleteRef} $readEntrySelectTimer={readEntrySelectTimer}>
          <DeleteButton $isMouseDown={isMouseDown} onMouseDown={handleStartDelete} onMouseUp={handleStopDelete} onMouseLeave={handleStopDelete}>
            <p className='mr-2'>Hold for 1 second</p>
            <Trash size={13} />
          </DeleteButton>
        </DeleteContainer>
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;