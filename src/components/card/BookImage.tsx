import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { FiSlash } from 'react-icons/fi';


interface BookImagePropsITF {
  pictureUrl: string;
  isEdit: boolean;
  editTimer: number;
  handleFlip: Function;
}

const EditBookButton = styled.button<{ $editTimer: number }>`
  ${tw`py-1 px-4 rounded border border-coolGray-50`};
  ${tw`bg-blueGray-300 bg-opacity-40 text-trueGray-50 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  --hoverDuration: 200ms;
  transition: all var(--hoverDuration) linear;
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`};
  }
  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity var(--editDuration) ease-in-out;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity var(--editDuration) ease-in-out;
  }
`;

const BookImage = ({ pictureUrl, isEdit, editTimer, handleFlip }: BookImagePropsITF) => {
  const bookImageRef = useRef(null);

  return (
    <div className='col-start-1 col-end-2 row-start-4 row-end-20 rounded-tl-2xl'>
      {pictureUrl === ''
      ? <div className='h-full w-full flex flex-col justify-center items-center border-t border-r border-blueGray-50'>
          <FiSlash className='text-red-500 opacity-40' size={75} />
          <p className='font-AdventPro-400 text-xl opacity-60'>No Picture</p>
        </div>
      : <div className='h-full w-full flex justify-center items-center bg-cover bg-center' style={{backgroundImage: `url(${pictureUrl})`}}>
          <CSSTransition in={isEdit} timeout={editTimer} classNames='fade' nodeRef={bookImageRef} unmountOnExit>
            <EditBookButton ref={bookImageRef} $editTimer={editTimer} onClick={() => handleFlip()}>Edit Book</EditBookButton>
          </CSSTransition>
        </div>
      }
    </div>
  )
}

export default BookImage;