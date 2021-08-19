import React from 'react';

const ProgressBar = ({currentPercent}: {currentPercent: number}) => {
  return (
    <div className='flex items-center h-2 w-full'>
      <div className='relative flex content-center items-center h-full w-full rounded-sm bg-teal-100'>
        <div style={{width: `${currentPercent}%`}} className='absolute h-4/6 bg-teal-600'></div>
      </div>
    </div>
  )
}

export default ProgressBar;