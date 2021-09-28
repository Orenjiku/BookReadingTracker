import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

interface BookImagePropsITF {
  pictureLink: string;
  isEdit: boolean;
  handleFlip: Function;
}

const EditBookButton = styled.button`
  ${tw`h-8 w-24 rounded border border-coolGray-50 flex justify-center items-center`};
  ${tw`bg-blueGray-300 bg-opacity-40 text-trueGray-50 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur`};
  ${tw`transition-colors duration-300 ease-linear`};
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`};
    ${tw`transition-colors duration-300 ease-linear`};
  }
  &.fade-enter {
    ${tw`opacity-0`};
  }
  &.fade-enter-active {
    ${tw`opacity-100 transition-opacity duration-500 ease-in-out`};
  }
  &.fade-exit-active {
    ${tw`opacity-0 transition-opacity duration-500 ease-in-out`};
  }
`;

const BookImage = ({ pictureLink, isEdit, handleFlip }: BookImagePropsITF) => {
  const bookImageRef = useRef(null);
  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-20 rounded-tl-2xl grid place-content-center bg-cover bg-center overflow-hidden' style={{backgroundImage: `url(${pictureLink})`}}>
      <CSSTransition in={isEdit} timeout={500} classNames='fade' nodeRef={bookImageRef} unmountOnExit>
        <EditBookButton ref={bookImageRef} onClick={() => handleFlip()}>Edit Book</EditBookButton>
      </CSSTransition>
    </div>
  )
}

export default BookImage;