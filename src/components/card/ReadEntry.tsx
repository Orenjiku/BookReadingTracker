import React from 'react';
import { ReadEntryITF } from '../../interfaces/interface';
import ProgressBar from './ProgressBar';

interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  totalPages: number;
}

const ReadEntry = ({ readEntry, totalPages }: ReadEntryPropsITF) => {
  return (
    <div className='flex h-4 my-0.5'>
      <div className='mr-2 text-xs font-SortsMillGoudy-400'>{new Date(readEntry.date_read).toLocaleDateString()}</div>
      <ProgressBar pagesRead={readEntry.pages_read} currentPage={readEntry.current_page} currentPercent={readEntry.current_percent} totalPages={totalPages} />
    </div>
  )
}

export default ReadEntry;