import React, { useState, useEffect, useRef } from 'react';
import tw, {styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ReadEntryITF } from '../../interfaces/interface';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import ProgressBar from './ProgressBar';
import SuccessIndicator from './SuccessIndicator';
import { CgPushChevronDownR } from 'react-icons/cg';
import { Trash } from '@styled-icons/bootstrap/Trash';


interface ReadEntryPropsITF {
  readEntry: ReadEntryITF;
  readerBookId: number;
  readInstanceId: number;
  isEdit: boolean;
  editTimer: number;
  readEntrySelectTimer: number;
  handleReadEntrySelectToggle: Function;
  handleUpdateReaderBook: Function;
}

const EntryBar = styled.div<{ $isEdit: boolean; $before: string; $after: number }>`
  ${tw`relative px-0.5 flex justify-center`};
  ${tw`text-trueGray-900 text-xs font-SortsMillGoudy-400`};
  &::before {
    content: '${({ $before }) => $before}';
    ${tw`absolute left-0`};
  }
  &::after {
    ${({ $isEdit, $after }) => $isEdit
      ? css`
        content: 'pg. ${$after}';
        ${tw`absolute right-0 text-trueGray-900`};
      `
      : css`
        content: '+${$after} pgs';
        ${tw`absolute right-0 text-green-600`};
      `
    }
  }
`;

const DeleteContainer = styled.div<{ $readEntrySelectTimer: number }>`
  ${tw`flex justify-center p-0 mb-0 overflow-y-hidden`};
  --duration: ${({ $readEntrySelectTimer }) => `${$readEntrySelectTimer}ms`};
  &.slide-enter {
    max-height: 0;
  }
  &.slide-enter-active {
    max-height: 26px;
    transition: all var(--duration) ease-out;
  }
  &.slide-exit {
    max-height: 26px;
    opacity: 1;
  }
  &.slide-exit-active {
    max-height: 0;
    transition: all var(--duration) ease-out;
  }
`;

const DeleteButton = styled.button<{ $isStartSubmit: boolean }>`
  ${tw`px-1.5 mx-1 rounded flex justify-center items-center`};
  ${tw`bg-red-400 text-trueGray-50 text-sm font-AdventPro-200`};
  height: 26px;
  ${tw`transition-colors duration-200 ease-linear`};
  ${({ $isStartSubmit }) => $isStartSubmit && css`
    ${tw`bg-red-500 transition-colors duration-1000 ease-linear`};
  `}
`;

const ReadEntry = ({ readEntry, readerBookId, readInstanceId, isEdit, editTimer, readEntrySelectTimer, handleReadEntrySelectToggle, handleUpdateReaderBook }: ReadEntryPropsITF) => {
  const [ isEntrySelected, setIsEntrySelected ] = useState<boolean>(false);

  const readEntryDeleteRef = useRef(null);
  const entryDate = new Date(readEntry.date_read).toLocaleDateString();
  const currentPercent = Number(readEntry.current_percent.toFixed(0));

  useEffect(() => {
    if (!isEdit) {
      setIsEntrySelected(false);
    }
  }, [isEdit]);

  const handleEntrySelect = () => isEdit && setIsEntrySelected(isEntrySelected => !isEntrySelected);

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

  useEffect(() => {
    !isEntrySelected && resetReadEntrySubmitStates();
  }, [isEntrySelected])

  const handleSubmitReadEntry = async () => {
    try {
      const response = await fetch(`http://localhost:3000/1/book/read_entry`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId, readInstanceId, readEntryId: readEntry.re_id, readEntryPagesRead: readEntry.pages_read })
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
  };

  const submitHoldTimer = 1000;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleSubmitReadEntry);

  return (
    <div>

      <div className={`relative px-1 pb-0.5 ${isEdit && 'cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30'}`} onClick={() => { handleEntrySelect(); handleReadEntrySelectToggle() }}>
        <EntryBar $isEdit={isEdit} $before={entryDate} $after={isEdit ? readEntry.current_page : readEntry.pages_read}>{`${currentPercent}%`}</EntryBar>
        <ProgressBar isEdit={isEdit} editTimer={editTimer} currentPercent={currentPercent} />
      </div>

      <CSSTransition in={isEdit && isEntrySelected} timeout={readEntrySelectTimer} classNames='slide' nodeRef={readEntryDeleteRef} unmountOnExit>
        <DeleteContainer ref={readEntryDeleteRef} $readEntrySelectTimer={readEntrySelectTimer}>
          <div className='flex items-end'>
            <DeleteButton $isStartSubmit={isStartSubmit} onMouseDown={() => { handleStartSubmit(); resetReadEntrySubmitStates()}} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>
              <CgPushChevronDownR />
              <p className='mx-2'>Hold for 1 second</p>
              <Trash size={13} />
            </DeleteButton>
          </div>
          <SuccessIndicator size={13} isSuccess={isSubmitReadEntrySuccess} isFail={isSubmitReadEntryFail} indicatorTransitionTimer={300} />
        </DeleteContainer>
      </CSSTransition>

    </div>
  )
}

export default ReadEntry;