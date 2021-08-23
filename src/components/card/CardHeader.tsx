import React from 'react';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
}

const CardHeader = ({title, author}: CardHeaderPropsITF) => {
  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl'>
      <div className='font-AdventPro-200 text-2xl pl-7 text-sky-900 truncate'>{title}</div>
      <div className='absolute top-8 w-10 h-0.5 bg-sky-900'></div>
      <div className='flex w-full justify-end font-Charm-400 text-trueGray-900 pr-2 truncate'>{author.join(', ')}</div>
    </div>
    )
}

export default CardHeader;