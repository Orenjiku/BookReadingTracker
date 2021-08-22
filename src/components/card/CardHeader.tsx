import React from 'react';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
}

const CardHeader = ({title, author}: CardHeaderPropsITF) => {
  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl truncate'>
      <div className='font-AdventPro-200 text-2xl pl-7 text-sky-900'>{title}</div>
      <div className='absolute top-8 w-10 h-0.5 bg-sky-900'></div>
      <div className='flex w-full justify-end'>
        <div className='flex w-1/2 justify-end font-Charm-400 text-coolGray-900'>{author.join(', ')}</div>
      </div>
    </div>
    )
}

export default CardHeader;