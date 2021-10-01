import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';


interface BookImagePropsITF {
  pictureLink: string;
  isEdit: boolean;
  editTimer: number;
  handleFlip: Function;
}

const EditBookButton = styled.button<{ $editTimer: number }>`
  ${tw`h-8 w-24 rounded border border-coolGray-50 flex justify-center items-center`};
  ${tw`bg-blueGray-300 bg-opacity-40 text-trueGray-50 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur`};
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: opacity 500ms linear;
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`};
    ${tw`transition-colors duration-300 ease-linear`};
  }
  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity var(--duration) ease-in-out;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity var(--duration) ease-in-out;
  }
`;

const BookImage = ({ pictureLink, isEdit, editTimer, handleFlip }: BookImagePropsITF) => {
  const bookImageRef = useRef(null);

  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-20 rounded-tl-2xl grid place-content-center bg-cover bg-center overflow-hidden' style={{backgroundImage: `url(${pictureLink})`}}>
      <CSSTransition in={isEdit} timeout={editTimer} classNames='fade' nodeRef={bookImageRef} unmountOnExit>
        <EditBookButton ref={bookImageRef} $editTimer={editTimer} onClick={() => handleFlip()}>Edit Book</EditBookButton>
      </CSSTransition>
    </div>
  )
}

export default BookImage;