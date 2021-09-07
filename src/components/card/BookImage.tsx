import React from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

interface BookImagePropsITF {
  pictureLink: string;
  isUpdating: boolean;
  handleFlip: Function;
}

const Button = styled.div<{isUpdating: boolean}>`
  ${tw`h-8 w-24 flex justify-center items-center rounded cursor-pointer`};
  ${tw`bg-blueGray-300 bg-opacity-40 text-trueGray-50 font-Charm-400`};
  ${tw`filter backdrop-filter backdrop-blur`};
  ${tw`transition-colors duration-300 ease-linear`}
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`}
    ${tw`transition-colors duration-300 ease-linear`};
  }
  &.fade-enter {
    ${tw`opacity-0`}
  }
  &.fade-enter-active {
    ${tw`opacity-100 transition-opacity duration-500 ease-in-out`}
  }
  &.fade-exit-active {
    ${tw`opacity-0 transition-opacity duration-500 ease-in-out`}
  }
`

const BookImage = ({ pictureLink, isUpdating, handleFlip }: BookImagePropsITF) => {
  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-19 grid place-content-center rounded-tl-2xl bg-cover overflow-hidden' style={{backgroundImage: `url(${pictureLink})`}}>
      <CSSTransition in={isUpdating} timeout={500} classNames='fade' unmountOnExit>
        <Button isUpdating={isUpdating} onClick={() => handleFlip()}>{isUpdating && <span>Edit Book</span>}</Button>
      </CSSTransition>
    </div>
  )
}

export default BookImage;