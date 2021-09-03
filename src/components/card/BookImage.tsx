import React from 'react';
import tw, { styled, css } from 'twin.macro';

const Button = styled.div<{isUpdating: boolean}>`
  ${({ isUpdating }) => isUpdating && css`
    ${tw`h-10 w-40 flex justify-center items-center bg-orange-300 z-30`}
  `}
`

const BookImage = ({ pictureLink, isUpdating }: {pictureLink: string; isUpdating: boolean }) => {
  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-19 grid place-content-center overflow-hidden bg-cover' style={{backgroundImage: `url(${pictureLink})`}}>
      <Button isUpdating={isUpdating} />
    </div>
  )
}

export default BookImage;