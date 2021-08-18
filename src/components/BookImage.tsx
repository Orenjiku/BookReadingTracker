import React from 'react';

const BookImage = ({ pictureLink }: {pictureLink: string}) => {
  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-19 overflow-hidden'>
      <img className='rounded-tl-2xl' src={pictureLink} />
    </div>
  )
}

export default BookImage;