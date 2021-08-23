import React from 'react';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';
import { BsTrash } from 'react-icons/bs';
import { CSSTransition } from 'react-transition-group';
// import {styled} from 'twin.macro';
// import { Trash } from '@styled-icons/bootstrap/Trash';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  handleDeleteReadEntry: Function;
  isUpdateProgress: boolean;
}

const ReadEntry = ({ readEntry, handleDeleteReadEntry, isUpdateProgress }: ReadEntryPropsITF) => {
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
      <CSSTransition in={isUpdateProgress} timeout={300} classNames='trash' unmountOnExit>
        <BsTrash size={13} className='fill-current text-red-700 mr-0.5 cursor-pointer' onClick={() => handleDeleteReadEntry(readEntry.re_id)}/>
      </CSSTransition>

      {/* {isUpdateProgress &&
        <BsTrash size={13} className='fill-current text-red-700 mr-0.5 cursor-pointer' onClick={() => handleDeleteReadEntry(readEntry.re_id)}/>
      } */}

    </div>
  )
}

export default ReadEntry;