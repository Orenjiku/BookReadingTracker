import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import tw, { styled, css } from 'twin.macro';
import useHoldSubmit from '../../../hooks/useHoldSubmit';
import useDelayReset from '../../../hooks/useDelayReset';
import { StyledButton } from '../common/styled';
import { isValidDate } from '../common/utils';
import FormLabel from '../common/FormLabel';
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
  indicatorTransitionTimer: number;
  handleUpdateReaderBook: Function;
};

const ReadEntryAddContainer = styled.div<{ $slideTimer: number }>`
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

const StyledBsCircle = styled(BsCircleFill)<{ $inner?: boolean, $outer?: boolean, $isStartSubmit: boolean, $submitHoldTimer: number}>`
  ${tw`absolute opacity-0`}
  --holdDuration: ${({ $submitHoldTimer}) => `${$submitHoldTimer}ms`};
  ${({ $inner }) => $inner && css`
    ${tw`absolute bg-blueGray-400 bg-opacity-30`}
    height: 120px;
    width: 120px;
    border-radius: 50%;
    z-index: -1;
  `}
  ${({ $outer }) => $outer && css`
    ${tw`absolute bg-blueGray-900`};
    height: 200px;
    width: 200px;
    border-radius: 50%;
    z-index: -2;
  `}
  ${({ $isStartSubmit }) => $isStartSubmit && css`
    ${tw`opacity-40`};
    transform: scale(.1);
    transition: transform var(--holdDuration) linear;
  `}
`;

const StyledChevronDown = styled(CgPushChevronDownR)`
  ${tw`ml-0.5 text-blueGray-50`};
  transition: transform 200ms ease-out;
  ${ReadInstanceEditSelectContainer}:hover & {
    ${tw`text-blueGray-900`}
    transform: translateY(25%);
    --neon-light-center: #f9fafb;
    --neon-light-color: #0d9488;
    --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                    drop-shadow(0 0 6px var(--neon-light-center))
                    drop-shadow(0 0 16px var(--neon-light-color));
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: filter 200ms transform 200ms, linear;
  }
`;

const EditView = ({ readerBookId, readInstanceId, totalPages, isEdit, editTimer, isFlipped, flipTimer, indicatorTransitionTimer, handleUpdateReaderBook }: EditViewPropsITF) => {
  const [ readEntryDate, setReadEntryDate ] = useState(new Date(Date.now()).toISOString().slice(0, 10));
  const [ readEntryCurrentPage, setReadEntryCurrentPage ] = useState('');

  const [ isSubmitDateSuccess, setIsSubmitDateSuccess ] = useState(false);
  const [ isSubmitDateFail, setIsSubmitDateFail ] = useState(false);

  const [ isSubmitPageSuccess, setIsSubmitPageSuccess ] = useState(false);
  const [ isSubmitPageFail, setIsSubmitPageFail ] = useState(false);

  const [ isReadEntryEditView, setIsReadEntryEditView ] = useState(true);
  const slideTimer = 300;
  const readEntryEditContainerRef = useRef(null);
  const readInstanceEditContainerRef = useRef(null);

  const handleChangeEditView = () => setIsReadEntryEditView(prevIsReadEntryEditView => !prevIsReadEntryEditView);

  const toggleSubmitDateSuccessState = () => {
    setIsSubmitDateSuccess(true);
    setIsSubmitDateFail(false);
  };

  const toggleSubmitDateFailState = () => {
    setIsSubmitDateSuccess(false);
    setIsSubmitDateFail(true);
  };

  const toggleSubmitPageSuccessState = () => {
    setIsSubmitPageSuccess(true);
    setIsSubmitPageFail(false);
  };

  const toggleSubmitPageFailState = () => {
    setIsSubmitPageSuccess(false);
    setIsSubmitPageFail(true);
  };

  const resetSubmitDateStates = () => {
    setIsSubmitDateSuccess(false);
    setIsSubmitDateFail(false);
  };

  const resetSubmitPageStates = () => {
    setIsSubmitPageSuccess(false);
    setIsSubmitPageFail(false);
  };

  const resetAllStates = () => {
    setIsReadEntryEditView(true);
    setReadEntryDate(new Date(Date.now()).toISOString().slice(0, 10));
    setReadEntryCurrentPage('');
    resetSubmitDateStates();
    resetSubmitPageStates();
  };

  useDelayReset(isEdit, false, editTimer, resetAllStates);
  useDelayReset(isFlipped, true, flipTimer / 2, resetAllStates);

  //function sent to FormLabel to reset all success/fail indicator states related to EditView.
  const handleMassReset = () => {
    resetSubmitDateStates();
    resetSubmitPageStates();
  };

  //clear inputs and submit status when page change
  useEffect(() => {
    let delayTimeout: ReturnType<typeof setTimeout>;
    if (!isReadEntryEditView) {
      delayTimeout = setTimeout(() => {
        resetSubmitDateStates();
        resetSubmitPageStates();
      }, slideTimer);
    }
    () => clearTimeout(delayTimeout);
  }, [isReadEntryEditView]);
  //---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'readEntryDate') {
      setReadEntryDate(e.target.value);
      resetSubmitDateStates();
      isSubmitPageSuccess && resetSubmitPageStates();
    }
    else if (e.target.name === 'readEntryCurrentPage') {
      setReadEntryCurrentPage(e.target.value);
      resetSubmitPageStates();
      isSubmitDateSuccess && resetSubmitDateStates();
    }
  };

  const handleSubmitReadEntry = async () => {
    const dateString = `${readEntryDate} ${new Date().toTimeString().slice(0, 8)}`;
    if (!isValidDate(readEntryDate) && readEntryCurrentPage === '') {
      toggleSubmitDateFailState();
      toggleSubmitPageFailState();
    } else if (!isValidDate(readEntryDate) && readEntryCurrentPage !== '') {
      toggleSubmitDateFailState();
    } else if (isValidDate(readEntryDate) && readEntryCurrentPage === '') {
      toggleSubmitPageFailState();
    } else if (isValidDate(readEntryDate) && readEntryCurrentPage !== '') {
      try {
        const response = await fetch('http://localhost:3000/1/book/read_entry', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ readerBookId, readInstanceId, dateString, currentPage: Number(readEntryCurrentPage), totalPages })
        });
        if (response.ok) {
          const result = await response.json();
          handleUpdateReaderBook(result);
          setReadEntryCurrentPage('');
          toggleSubmitDateSuccessState();
          toggleSubmitPageSuccessState();
        } else {
          toggleSubmitDateFailState();
          toggleSubmitPageFailState();
        }
      } catch(err) {
        console.error(err);
        toggleSubmitDateFailState();
        toggleSubmitPageFailState();
      }
    }
  };

  const handleSubmitReadEntryWithEnter = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmitReadEntry();

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
  };

  const submitPostHoldTimer = 600;
  const submitDeleteHoldTimer = 1000;
  const [ isStartPostSubmit, handleStartPostSubmit, handleStopPostSubmit ] = useHoldSubmit(submitPostHoldTimer, handlePostReadInstance);
  const [ isStartDeleteSubmit, handleStartDeleteSubmit, handleStopDeleteSubmit ] = useHoldSubmit(submitDeleteHoldTimer, handleDeleteReadInstance);

  return (
    <div style={{height: '109.14px'}} className='relative w-full'>
      <CSSTransition in={isReadEntryEditView} timeout={slideTimer} classNames='slide' nodeRef={readEntryEditContainerRef} unmountOnExit>
        <ReadEntryAddContainer $slideTimer={slideTimer} ref={readEntryEditContainerRef}>
          <form className='col-start-1 col-end-11 ml-2 mr-1 flex flex-col justify-center'>
            <FormLabel type='text' label='Date' name='readEntryDate' value={readEntryDate} placeholder='yyyy-mm-dd' submitStatus={[isSubmitDateSuccess, isSubmitDateFail]} feedbackText='' indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={handleMassReset} handleEnter={handleSubmitReadEntryWithEnter} />

            <div className='flex'>
              <FormLabel type='number' label='Page' name='readEntryCurrentPage' value={readEntryCurrentPage} placeholder='#' submitStatus={[isSubmitPageSuccess, isSubmitPageFail]} feedbackText='' indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={handleMassReset} handleEnter={handleSubmitReadEntryWithEnter} />
              <div className='mb-0.5 ml-1 flex items-end'>
                <StyledButton type='button' onClick={handleSubmitReadEntry}>Add</StyledButton>
              </div>
            </div>
          </form>

          <div className='col-start-11 col-end-13 flex items-center cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30' onClick={handleChangeEditView}>
            <BsChevronRight className='absolute right-0 stroke-current stroke-1 text-coolGray-50' />
          </div>
        </ReadEntryAddContainer>
      </CSSTransition>

      <CSSTransition in={!isReadEntryEditView} timeout={slideTimer} classNames='slide' nodeRef={readInstanceEditContainerRef} unmountOnExit>
        <ReadInstanceEditContainer $slideTimer={slideTimer} ref={readInstanceEditContainerRef}>
          <div className='col-start-1 col-end-3 row-start-1 row-end-3 flex items-center cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30' onClick={handleChangeEditView}>
            <BsChevronLeft className='absolute left-0 stroke-current stroke-1 text-coolGray-50' />
          </div>

          <div className='col-start-3 col-end-13 flex flex-col'>
            <ReadInstanceEditSelectContainer onMouseDown={() => handleStartPostSubmit()} onMouseUp={() => handleStopPostSubmit()} onMouseLeave={() => handleStopPostSubmit()}>
              <p>New Read</p>
              <StyledChevronDown />
              <StyledBsCircle $inner $isStartSubmit={isStartPostSubmit} $submitHoldTimer={submitPostHoldTimer} />
              <StyledBsCircle $outer $isStartSubmit={isStartPostSubmit} $submitHoldTimer={submitPostHoldTimer} />
            </ReadInstanceEditSelectContainer>
            <ReadInstanceEditSelectContainer onMouseDown={() => handleStartDeleteSubmit()} onMouseUp={() => handleStopDeleteSubmit()} onMouseLeave={() => handleStopDeleteSubmit()}>
              <p>Delete Read</p>
              <StyledChevronDown />
              <StyledBsCircle $inner $isStartSubmit={isStartDeleteSubmit} $submitHoldTimer={submitDeleteHoldTimer} />
              <StyledBsCircle $outer $isStartSubmit={isStartDeleteSubmit} $submitHoldTimer={submitDeleteHoldTimer} />
            </ReadInstanceEditSelectContainer>
          </div>
        </ReadInstanceEditContainer>
      </CSSTransition>
    </div>
  )
};

export default EditView;