import React from 'react';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
}

const ReadEntry = ({ readEntry }: ReadEntryPropsITF) => {
  return (
    <div className='px-1'>
      <div className='relative flex h-4 my-0.5 text-xs '>
        <div className='mr-2 font-SortsMillGoudy-400'>{new Date(readEntry.date_read).toLocaleDateString()}</div>
        <div className='absolute flex w-full justify-center'>{`${readEntry.current_percent.toFixed(0)}%`}</div>
        <div className='flex w-full h-full justify-end text-black text-green-300'>{`+${readEntry.pages_read} pgs`}</div>
      </div>
      <ProgressBar currentPercent={readEntry.current_percent} />
    </div>
  )
}

export default ReadEntry;