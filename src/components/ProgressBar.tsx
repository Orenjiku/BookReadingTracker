import React from 'react';

interface ProgressBarPropsITF {
  pagesRead: number;
  currentPage: number;
  currentPercent: number;
  totalPages: number;
}

// const ProgressBar = ({ pagesRead, currentPage, currentPercent, totalPages}: ProgressBarPropsITF) => {
const ProgressBar = ({ pagesRead, currentPercent }: ProgressBarPropsITF) => {
  return (
    <div className='flex relative items-center h-full w-full font-SortsMillGoudy-400'>
      <div className='flex content-center items-center h-full w-full rounded-sm bg-teal-100'>
        <div style={{width: `${currentPercent}%`}} className='h-5/6 bg-teal-600'></div>
      </div>
      <div className='absolute flex w-full h-full justify-center items-center text-xs'>{`${currentPercent.toFixed(0)}%`}</div>
      <div className='absolute pr-1 flex w-full h-full justify-end items-center text-green-500 text-xs'>{`+${pagesRead} pgs`}</div>
    </div>
  )
}

export default ProgressBar;