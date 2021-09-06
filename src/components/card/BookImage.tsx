import React from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

const Button = styled.div<{isUpdating: boolean}>`
  ${tw`h-8 w-24 flex justify-center items-center bg-blueGray-300 bg-opacity-40 filter backdrop-filter backdrop-blur rounded cursor-pointer text-trueGray-50 font-Charm-400`};
  transition: background-color 300ms linear;
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`};
    transition: background-color 300ms linear;
  }
  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity 600ms ease-in-out;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity 600ms ease-in-out;
  }
`

const BookImage = ({ pictureLink, isUpdating, handleFlip }: { pictureLink: string; isUpdating: boolean; handleFlip: Function }) => {
  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-19 grid place-content-center overflow-hidden bg-cover rounded-tl-2xl' style={{backgroundImage: `url(${pictureLink})`}}>
      <CSSTransition in={isUpdating} timeout={600} classNames='fade' unmountOnExit>
        <Button isUpdating={isUpdating} onClick={() => handleFlip()}>{isUpdating && <p>Edit Book</p>}</Button>
      </CSSTransition>
    </div>
  )
}

export default BookImage;