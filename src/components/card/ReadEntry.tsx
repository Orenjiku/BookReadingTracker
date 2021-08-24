import React from 'react';
import tw, {styled} from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import { Trash } from '@styled-icons/bootstrap/Trash';
import ProgressBar from './ProgressBar';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  handleDeleteReadEntry: Function;
  isUpdating: boolean;
}

const EntryInfo = styled.div<{entryDate: string; pagesRead: number;}>`
  ${tw`relative flex justify-center w-full px-0.5 font-SortsMillGoudy-400 text-xs text-trueGray-900`};
  &::before {
    ${tw`absolute left-0`};
    content: '${({entryDate }) => entryDate }';
  };
  &::after {
    ${tw`absolute right-0 text-green-600`};
    content: '${({ pagesRead }) => `+${pagesRead}pgs`}';
  };
`

const slideDuration = 600;
const StyledTrash = styled(Trash)`
  ${tw`fill-current text-red-600 mr-0.5 cursor-pointer`};
  &.trashSlide-enter {
    transform: translateX(105%);
  };
  &.trashSlide-enter-active {
    transform: translateX(0%);
    transition: transform ${slideDuration}ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.trashSlide-exit-active {
    transform: translateX(105%);
    transition: transform ${slideDuration}ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
  };
`

const ReadEntry = ({ readEntry, handleDeleteReadEntry, isUpdating }: ReadEntryPropsITF) => {
  return (
    <div className='flex items-center'>

      <div className='px-1 mb-0.5 w-full'>
        <EntryInfo entryDate={new Date(readEntry.date_read).toLocaleDateString()} pagesRead={readEntry.pages_read}>
          {`${readEntry.current_percent.toFixed(0)}%`}
        </EntryInfo>
        <ProgressBar currentPercent={readEntry.current_percent} />
      </div>

      <CSSTransition in={isUpdating} timeout={slideDuration} classNames='trashSlide' unmountOnExit>
        <StyledTrash size={13} onClick={() => handleDeleteReadEntry(readEntry.re_id)} />
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;