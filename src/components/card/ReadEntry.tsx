import React from 'react';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';
import { BsTrash } from 'react-icons/bs';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
}

const ReadEntry = ({ readEntry }: ReadEntryPropsITF) => {
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
      <BsTrash size={13} className='fill-current text-red-700 cursor-pointer' />
    </div>
  )
}

export default ReadEntry;