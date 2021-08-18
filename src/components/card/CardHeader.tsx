import React from 'react';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
}

const CardHeader = ({title, author}: CardHeaderPropsITF) => {
  return (
    <div className='col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl'>
      <div className='text-coolGray-50 font-AdventPro-200 text-2xl pl-4 truncate'>{title}</div>
      <div className='flex justify-end pr-2 font-Charm-400 truncate'>{author.join(', ')}</div>
    </div>
    )
}

export default CardHeader;