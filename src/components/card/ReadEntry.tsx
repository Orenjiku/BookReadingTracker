import React, { useState, useEffect, useRef } from 'react';
import tw, {styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';
import { Trash } from '@styled-icons/bootstrap/Trash';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  isEdit: boolean;
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

const DeleteContainer = styled.div`
  ${tw`flex justify-center items-end p-0 mb-0 overflow-y-hidden`};
  &.slide-enter {
    max-height: 0;
  }
  &.slide-enter-active {
    max-height: 26px;
    ${tw`transition-all duration-300 ease-out`};
  }
  &.slide-exit {
    max-height: 26px;
    opacity: 1;
  }
  &.slide-exit-active {
    max-height: 0;
    ${tw`transition-all duration-300 ease-out`};
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

const ReadEntry = ({ readEntry, isEdit, handleDeleteReadEntry }: ReadEntryPropsITF) => {
  const [ isEntrySelected, setIsEntrySelected ] = useState<boolean>(false);
  const [ isMouseDown, setIsMouseDown ] = useState<boolean>(false);

  const readEntryRef = useRef(null);
  const entryDate = new Date(readEntry.date_read).toLocaleDateString();
  const currentPercent = Number(readEntry.current_percent.toFixed(0));
  let deleteTimeout: ReturnType<typeof setTimeout>;

  const handleEntrySelect = () => isEdit && setIsEntrySelected(isEntrySelected => !isEntrySelected);
  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => {
    clearTimeout(deleteTimeout);
    setIsMouseDown(false);
  };

  useEffect(() => {
    !isEdit && setIsEntrySelected(false);
  }, [isEdit])

  useEffect(() => {
    if (isMouseDown) {
      deleteTimeout = setTimeout(() => {
        handleDeleteReadEntry(readEntry.re_id);
        setIsMouseDown(false);
      }, 1000);
    }
  }, [isMouseDown]);

  return (
    <div>

      <div className={`relative px-1 pb-0.5 ${isEdit && 'cursor-pointer hover:bg-blueGray-300 hover:bg-opacity-50'}`} onClick={handleEntrySelect}>
        <EntryBar $before={entryDate} $after={readEntry.pages_read}>{`${currentPercent}%`}</EntryBar>
        <ProgressBar isEdit={isEdit} currentPercent={currentPercent} />
      </div>

      <CSSTransition in={isEdit && isEntrySelected} timeout={300} classNames='slide' nodeRef={readEntryRef} unmountOnExit>
        <DeleteContainer ref={readEntryRef}>
          <DeleteButton $isMouseDown={isMouseDown} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <p className='mr-2'>Hold for 1 second</p>
            <Trash size={13} />
          </DeleteButton>
        </DeleteContainer>
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;