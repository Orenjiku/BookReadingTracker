import React, { useState, useEffect, useRef } from 'react';
import tw, {styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import { Trash } from '@styled-icons/bootstrap/Trash';
import ProgressBar from './ProgressBar';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  isUpdating: boolean;
  handleDeleteReadEntry: Function;
}

const StyledAnimatedButton = styled.button<{isMouseDown: boolean}>`
  ${tw`flex justify-center items-center px-1.5 mx-1 rounded bg-red-300 text-trueGray-50 text-sm font-AdventPro-200 `};
  height: 26px;
  transition: all 1s linear;
  ${({ isMouseDown }) => isMouseDown && css`
    animation: color 1s linear;
    @keyframes color {
      0% {
        ${tw`bg-red-300`}
      }
      100% {
        ${tw`bg-red-500`}
      }
    }
  `}
`

const EntryBar = styled.div<{before: string; after: number;}>`
  ${tw`relative flex justify-center px-0.5 text-trueGray-900 text-xs font-SortsMillGoudy-400`};
  &::before {
    ${tw`absolute left-0`};
    content: '${({ before }) => before}';
  };
  &::after {
    ${tw`absolute right-0 text-green-600`};
    content: '${({ after }) => `+${after} pgs`}';
  };
`

const TrashContainer = styled.div`
  ${tw`flex justify-center items-end p-0 m-0`};
  &.trashSlide-enter {
    max-height: 0;
  };
  &.trashSlide-enter-active {
    max-height: 26px;
    transition: max-height 300ms ease-out;
  };
  &.trashSlide-exit {
    max-height: 26px;
  }
  &.trashSlide-exit-active {
    max-height: 0;
    transition: max-height 300ms ease-out;
  };
`

const ReadEntry = ({ readEntry, isUpdating, handleDeleteReadEntry }: ReadEntryPropsITF) => {
  const [isEntrySelected, setIsEntrySelected] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const readEntryRef = useRef(null);

  const entryDate = new Date(readEntry.date_read).toLocaleDateString();
  const pagesRead = readEntry.pages_read;
  const currentPercent = readEntry.current_percent.toFixed(0);

  useEffect(() => {
    !isUpdating && setIsEntrySelected(false);
  }, [isUpdating])

  const handleEntrySelect = () => isUpdating && setIsEntrySelected(isEntrySelected => !isEntrySelected);

  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (isMouseDown) {
      timeout = setTimeout(() => {
        handleDeleteReadEntry(readEntry.re_id);
        setIsMouseDown(false);
        clearTimeout(timeout);
      }, 1000);
    } else {
      clearTimeout(timeout);
    }
  }, [isMouseDown]);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    clearTimeout(timeout);
    setIsMouseDown(false);
  }

  return (
    <div>

      <div className={`relative px-1 pb-0.5 bg-blueGray-200 ${isUpdating && 'cursor-pointer hover:bg-blueGray-300'}`} {...(isUpdating && {onClick: handleEntrySelect})}>
        <EntryBar before={entryDate} after={pagesRead}>{`${currentPercent}%`}</EntryBar>
        <ProgressBar isUpdating={isUpdating} currentPercent={readEntry.current_percent} />
      </div>

      <CSSTransition in={isUpdating && isEntrySelected} timeout={300} classNames='trashSlide' nodeRef={readEntryRef} unmountOnExit>
        <TrashContainer ref={readEntryRef}>
          <StyledAnimatedButton isMouseDown={isMouseDown} onMouseDown={() => handleMouseDown()} onMouseUp={() => handleMouseUp()}>
            <p className='mr-2'>Hold for 1 second</p>
            <Trash size={13} />
          </StyledAnimatedButton>
        </TrashContainer>
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;