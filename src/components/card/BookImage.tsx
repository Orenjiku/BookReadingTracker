import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { BookListCategory } from '../../interfaces/interface';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import { StyledButton, HoldDownButton } from './styled';
import { CSSTransition } from 'react-transition-group';
import { CgPushChevronDownR } from 'react-icons/cg';
import { FiSlash } from 'react-icons/fi';


interface BookImagePropsITF {
  bookId: number;
  bookCoverUrl: string;
  category: BookListCategory;
  isEdit: boolean;
  editTimer: number;
  handleFlip: Function;
  handleUpdateBookList: Function;
}

const EditButton = styled(StyledButton)<{ $editTimer: number }>`
  ${tw`py-1 px-4 text-trueGray-50`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  --hoverDuration: 200ms;
  transition: all var(--hoverDuration) linear;
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

const DeleteButton = styled(HoldDownButton)<{ $editTimer: number }>`
  ${tw`py-1 px-4 text-trueGray-50`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  --hoverDuration: 200ms;
  transition: all var(--hoverDuration) linear;
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
`

const BookImage = ({ bookId, bookCoverUrl, category, isEdit, editTimer, handleFlip, handleUpdateBookList }: BookImagePropsITF) => {
  const editButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  const handleDeleteBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/1/book`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({bookId, category})
      });
      if (response.ok) {
        const result = await response.json();
        handleUpdateBookList(result);
      }
    } catch(err) {
      console.error(err);
    }
  };

  //handle Save Button onMouseDown hold effect before submit. handleSubmitAll needs to be declared before useHoldSubmit.
  const submitHoldTimer = 800;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleDeleteBook);
  //--

  return (
    <div className='relative col-start-1 col-end-2 row-start-4 row-end-20 flex justify-center items-center'>
      {bookCoverUrl === ''
      ? <div className='rounded-tl-2xl  h-full w-full flex flex-col justify-center items-center border-t border-r border-blueGray-50'>
          <FiSlash className='text-red-500 opacity-40' size={75} />
          <p className='font-AdventPro-400 text-xl opacity-60'>No Picture</p>
        </div>
      // backgroundImage has a sharper image than using img
      : <div className='rounded-tl-2xl h-full w-full flex justify-center items-center bg-cover bg-center' style={{backgroundImage: `url(${bookCoverUrl})`}} />
      // : <div className='rounded-tl-2xl h-full w-full flex justify-center items-center overflow-hidden'>
      //     <img src={bookCoverUrl} alt='book image' className='h-full w-full object-cover object-center' loading='lazy' />
      //   </div>
      }
      <div className='absolute top-20'>
        <CSSTransition in={isEdit} timeout={editTimer} classNames='fade' nodeRef={editButtonRef} unmountOnExit>
          <EditButton ref={editButtonRef} $editTimer={editTimer} onClick={() => handleFlip()}>Edit Book</EditButton>
        </CSSTransition>
      </div>
      <div className='absolute bottom-20'>
        <CSSTransition in={isEdit} timeout={editTimer} classNames='fade' nodeRef={deleteButtonRef} unmountOnExit>
          <DeleteButton ref={deleteButtonRef} $editTimer={editTimer} $red $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={() => handleStartSubmit()} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>
            <p className='mr-1'>Delete Book</p>
            <CgPushChevronDownR size={20} className='ml-0.5 current-stroke' />
          </DeleteButton>
        </CSSTransition>
      </div>
    </div>
  )
}

export default BookImage;