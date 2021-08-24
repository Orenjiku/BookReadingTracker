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

const StyledTrash = styled(Trash)`
  fill: ${tw`fill-current text-red-600`};
  ${tw`mr-0.5`};
  ${tw`cursor-pointer`};
  &.slide-enter {
    transform: translateX(105%);
  };
  &.slide-enter-active {
    transform: translateX(0%);
    transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.slide-exit-active {
    transform: translateX(105%);
    transition: transform 600ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
  };
`

const ReadEntry = ({ readEntry, handleDeleteReadEntry, isUpdating }: ReadEntryPropsITF) => {
  return (
    <div className='flex items-center'>

      <div className='px-1 mb-0.5 w-full'>
        <div className='relative flex justify-between px-0.5 font-SortsMillGoudy-400 text-xs text-trueGray-900'>
          <div>{new Date(readEntry.date_read).toLocaleDateString()}</div>
          <div className='text-green-600'>{`+${readEntry.pages_read} pgs`}</div>
          <div className='absolute flex w-full justify-center'>{`${readEntry.current_percent.toFixed(0)}%`}</div>
        </div>
        <ProgressBar currentPercent={readEntry.current_percent} />
      </div>

      <CSSTransition in={isUpdating} timeout={600} classNames='slide' unmountOnExit>
        <StyledTrash size={13} onClick={() => handleDeleteReadEntry(readEntry.re_id)} />
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;