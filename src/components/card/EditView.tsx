import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import tw, { styled, css } from 'twin.macro';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import { StyledButton } from './styled';
import { isValidDate } from './utils';
import FormLabel from './FormLabel';
import { BsChevronLeft, BsChevronRight, BsCircleFill } from 'react-icons/bs';
import { CgPushChevronDownR } from 'react-icons/cg';

interface EditViewPropsITF {
  readerBookId: number;
  readInstanceId: number;
  totalPages: number;
  isEdit: boolean;
  editTimer: number;
  isFlipped: boolean;
  flipTimer: number;
  handleUpdateReaderBook: Function;
}

const ReadEntryEditContainer = styled.div<{ $slideTimer: number }>`
  ${tw`absolute h-full w-full grid grid-cols-12 grid-rows-1`};
  --slideDuration: ${({ $slideTimer }) => `${$slideTimer}ms`};
  &.slide-enter {
    transform: translateX(-100%);
  }
  &.slide-enter-active {
    transform: translateX(0);
    transition: transform var(--slideDuration) linear;
  }
  &.slide-exit {
    transform: translateX(0);
  }
  &.slide-exit-active {
    transform: translateX(-100%);
    transition: transform var(--slideDuration) linear;
  }
`;

const ReadInstanceEditContainer = styled.div<{ $slideTimer: number }>`
  ${tw`absolute h-full w-full grid grid-cols-12 grid-rows-1`};
  --slideDuration: ${({ $slideTimer }) => `${$slideTimer}ms`};
  &.slide-enter {
    transform: translateX(100%);
  }
  &.slide-enter-active {
    transform: translateX(0);
    transition: transform var(--slideDuration) linear;
  }
  &.slide-exit {
    transform: translateX(0);
  }
  &.slide-exit-active {
    transform: translateX(100%);
    transition: transform var(--slideDuration) linear;
  }
`;

const ReadInstanceEditSelectContainer = styled.div`
  ${tw`relative h-1/2 flex justify-center items-center cursor-pointer overflow-hidden`};
  ${tw`opacity-60 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap text-xl`};
  text-shadow: 0px -1px 1px white, 0px -1px 1px white, 0px 1px 2px black;
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-30 opacity-80`}
  }
  `;

const StyledBsCircle = styled(BsCircleFill)<{ $isStartSubmit: boolean, $submitHoldTimer: number}>`
  ${tw`absolute bg-blueGray-900 opacity-0`};
  --holdDuration: ${({ $submitHoldTimer}) => `${$submitHoldTimer}ms`};
  height: 200px;
  width: 200px;
  border-radius: 50%;
  z-index: -1;
  transform-origin: center;
  ${({ $isStartSubmit }) => $isStartSubmit && css`
    ${tw`opacity-40`};
    transform: scale(.1);
    transition: transform var(--holdDuration) linear;
  `}
`;

const EditView = ({ readerBookId, readInstanceId, totalPages, isEdit, editTimer, isFlipped, flipTimer, handleUpdateReaderBook }: EditViewPropsITF) => {
  const [ readEntryDate, setReadEntryDate ] = useState(new Date(Date.now()).toISOString().slice(0, 10));
  const [ readEntryCurrentPage, setReadEntryCurrentPage ] = useState('');

  const [ isSubmitReadEntrySuccess, setIsSubmitReadEntrySuccess ] = useState(false);
  const [ isSubmitReadEntryFail, setIsSubmitReadEntryFail ] = useState(false);

  const toggleReadEntrySubmitSuccessState = () => {
    setIsSubmitReadEntrySuccess(true);
    setIsSubmitReadEntryFail(false);
  };

  const toggleReadEntrySubmitFailState = () => {
    setIsSubmitReadEntrySuccess(false);
    setIsSubmitReadEntryFail(true);
  };

  const resetReadEntrySubmitStates = () => {
    setIsSubmitReadEntrySuccess(false);
    setIsSubmitReadEntryFail(false);
  };

  //clear inputs ad submit status when edit state is changed to false.
  useEffect(() => {
    let delayTimeout: ReturnType<typeof setTimeout>;
    if (!isEdit) {
      delayTimeout = setTimeout(() => {
        setReadEntryDate(new Date(Date.now()).toISOString().slice(0, 10));
        setReadEntryCurrentPage('');
        resetReadEntrySubmitStates();
      }, editTimer);
    }
    () => clearTimeout(delayTimeout);
  }, [isEdit]);
  //---

  //clear inputs and submit status when card is flipped.
  useEffect(() => {
    let delayTimeout: ReturnType<typeof setTimeout>;
    if (isFlipped) {
      delayTimeout = setTimeout(() => {
        setReadEntryDate(new Date(Date.now()).toISOString().slice(0, 10));
        setReadEntryCurrentPage('');
        resetReadEntrySubmitStates();
      }, flipTimer / 2);
    }
    () => clearTimeout(delayTimeout);
  }, [isFlipped]);
  //---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'readEntryDate') setReadEntryDate(e.target.value);
    else if (e.target.name === 'readEntryCurrentPage') setReadEntryCurrentPage(e.target.value);
    resetReadEntrySubmitStates();
  };

  const handleSubmitReadEntry = async () => {
    const dateString = `${readEntryDate} ${new Date().toTimeString().slice(0, 8)}`;
    if (isValidDate(readEntryDate) && readEntryCurrentPage !== '') {
      try {
        const response = await fetch('http://localhost:3000/1/book/read_entry', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ readerBookId, readInstanceId, dateString, currentPage: Number(readEntryCurrentPage), totalPages })
        });
        if (response.ok) {
          toggleReadEntrySubmitSuccessState();
          const result = await response.json();
          handleUpdateReaderBook(result);
        } else {
          toggleReadEntrySubmitFailState();
        }
      } catch(err) {
        console.error(err);
        toggleReadEntrySubmitFailState();
      }
    } else {
      readEntryCurrentPage.trim() === '' && setReadEntryCurrentPage(''); //reset text cursor if value is a string of only spaces.
      toggleReadEntrySubmitFailState();
    }
  };

  const handlePostReadInstance = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/book/read_instance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId })
      })
      if (response.ok) {
        const result = await response.json();
        handleUpdateReaderBook(result);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleDeleteReadInstance = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/book/read_instance', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId, readInstanceId })
      })
      if (response.ok) {
        const result = await response.json();
        handleUpdateReaderBook(result);
      }
    } catch(err) {
      console.error(err);
    }
  }

  const [ isDefaultPage, setIsDefaultPage ] = useState(true);
  const slideTimer = 300;
  const readEntryEditContainerRef = useRef(null);
  const readInstanceEditContainerRef = useRef(null);

  const handleChangePage = () => setIsDefaultPage(prevIsDefaultPage => !prevIsDefaultPage);

  const submitPostHoldTimer = 500;
  const submitDeleteHoldTimer = 1000;
  const [ isStartPostSubmit, handleStartPostSubmit, handleStopPostSubmit ] = useHoldSubmit(submitPostHoldTimer, handlePostReadInstance);
  const [ isStartDeleteSubmit, handleStartDeleteSubmit, handleStopDeleteSubmit ] = useHoldSubmit(submitDeleteHoldTimer, handleDeleteReadInstance);

  return (
    <div className='relative h-full w-full'>
      <CSSTransition in={isDefaultPage} timeout={slideTimer} classNames='slide' nodeRef={readEntryEditContainerRef} unmountOnExit>
        <ReadEntryEditContainer $slideTimer={slideTimer} ref={readEntryEditContainerRef}>
          <form className='col-start-1 col-end-11 ml-2 mr-1 flex flex-col justify-center items-center'>
            <FormLabel type='text' label='Date' name='readEntryDate' value={readEntryDate} placeholder='yyyy-mm-dd' submitStatus={[isSubmitReadEntrySuccess, isSubmitReadEntryFail]} feedbackText='' handleInputChange={handleInputChange} />

            <div className='flex'>
              <FormLabel type='number' label='Page' name='readEntryCurrentPage' value={readEntryCurrentPage} placeholder='#' submitStatus={[isSubmitReadEntrySuccess, isSubmitReadEntryFail]} feedbackText='' handleInputChange={handleInputChange} />
              <div className='mb-0.5 ml-1 flex items-end'>
                <StyledButton type='button' onClick={handleSubmitReadEntry}>Add</StyledButton>
              </div>
            </div>
          </form>

          <div className='col-start-11 col-end-13 flex justify-center items-center cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30' onClick={handleChangePage}>
            <BsChevronRight className='absolute right-0 stroke-current stroke-1 text-coolGray-50' />
          </div>
        </ReadEntryEditContainer>
      </CSSTransition>

      <CSSTransition in={!isDefaultPage} timeout={slideTimer} classNames='slide' nodeRef={readInstanceEditContainerRef} unmountOnExit>
        <ReadInstanceEditContainer $slideTimer={slideTimer} ref={readInstanceEditContainerRef}>
          <div className='col-start-1 col-end-3 flex justify-center items-center cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30' onClick={handleChangePage}>
            <BsChevronLeft className='absolute left-0 stroke-current stroke-1 text-coolGray-50' />
          </div>
          <div className='col-start-3 col-end-13 flex flex-col'>
            <ReadInstanceEditSelectContainer onMouseDown={() => handleStartPostSubmit()} onMouseUp={() => handleStopPostSubmit()} onMouseLeave={() => handleStopPostSubmit()}>
              <p>New Read</p>
              <CgPushChevronDownR className='current-stroke text-blueGray-700' />
              <StyledBsCircle $isStartSubmit={isStartPostSubmit} $submitHoldTimer={submitPostHoldTimer} />
            </ReadInstanceEditSelectContainer>
            <ReadInstanceEditSelectContainer onMouseDown={() => handleStartDeleteSubmit()} onMouseUp={() => handleStopDeleteSubmit()} onMouseLeave={() => handleStopDeleteSubmit()}>
              <p>Delete Read</p>
              <CgPushChevronDownR className='current-stroke text-blueGray-700' />
              <StyledBsCircle $isStartSubmit={isStartDeleteSubmit} $submitHoldTimer={submitDeleteHoldTimer} />
            </ReadInstanceEditSelectContainer>
          </div>

        </ReadInstanceEditContainer>
      </CSSTransition>
    </div>
  )
}

export default EditView;