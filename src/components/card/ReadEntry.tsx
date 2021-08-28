import React, { useState, useEffect } from 'react';
import tw, {styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import { Trash } from '@styled-icons/bootstrap/Trash';
import ProgressBar from './ProgressBar';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  isUpdating: boolean;
  handleDeleteReadEntry: Function;
}

const Button = styled.button`
  ${tw`font-AdventPro-200 text-sm border rounded px-1.5 mx-1 flex justify-center items-center bg-red-500 text-coolGray-50`};
  height: 26px;
`

const ReadEntryContainer = styled.div`
  &.readEntryDelete-exit {
    opacity: 1;
    max-height: 50px;
  };
  &.readEntryDelete-exit-active {
    opacity: 0;
    max-height: 0;
    transition: opacity 200ms ease-out, max-height 600ms ease-out;
  };
`

const EntryBar = styled.div<{before: string; after: number;}>`
  ${tw`relative flex justify-center px-0.5 text-xs text-trueGray-900 font-SortsMillGoudy-400`};
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

  const entryDate = new Date(readEntry.date_read).toLocaleDateString();
  const pagesRead = readEntry.pages_read;
  const currentPercent = readEntry.current_percent.toFixed(0);

  useEffect(() => {
    !isUpdating && setIsEntrySelected(false);
  }, [isUpdating])

  const handleEntrySelect = () => isUpdating && setIsEntrySelected(isEntrySelected => !isEntrySelected);

  let timeout: ReturnType<typeof setTimeout>;

  const handleMouseDown = (readEntryId: number) => {
    timeout = setTimeout(() => {
      handleDeleteReadEntry(readEntryId);
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(timeout);
  }

  return (
    <ReadEntryContainer>

      <div className={`relative px-1 pb-0.5 bg-blueGray-200 ${isUpdating && 'cursor-pointer hover:bg-blueGray-300'}`} {...(isUpdating && {onClick: handleEntrySelect})}>
        <EntryBar before={entryDate} after={pagesRead}>{`${currentPercent}%`}</EntryBar>
        <ProgressBar isUpdating={isUpdating} currentPercent={readEntry.current_percent} />
      </div>

      <CSSTransition in={isUpdating && isEntrySelected} timeout={300} classNames='trashSlide' unmountOnExit>
        <TrashContainer>
          <Button onMouseDown={() => handleMouseDown(readEntry.re_id)} onMouseUp={() => handleMouseUp()}>
            <p className='mr-2'>Hold for 1 second</p>
            <Trash size={13} />
          </Button>
        </TrashContainer>
      </CSSTransition>

    </ReadEntryContainer>
  )
}

export default ReadEntry;