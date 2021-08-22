import React from 'react';

const ProgressBar = ({currentPercent}: {currentPercent: number}) => {
  return (
    <div className='flex items-center h-2 w-full rounded-sm bg-coolGray-50'>
      <div style={{width: `${currentPercent}%`}} className='h-3/6 rounded-sm bg-teal-500'></div>
    </div>
  )
}

export default ProgressBar;