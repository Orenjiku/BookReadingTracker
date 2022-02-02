import React, { useState, useEffect } from 'react';
import useHoldSubmit from '../../../hooks/useHoldSubmit';
import ReadEntryDeleteButton from './ReadEntryDeleteButton';
import SuccessIndicator from '../common/SuccessIndicator';


interface ReadEntryDeleteBarITF {
  readerBookId: number;
  readInstanceId: number;
  readEntryId: number;
  pagesRead: number;
  isEntrySelected: boolean;
  handleUpdateReaderBook: Function
};

const ReadEntryDeleteBar = ({ readerBookId, readInstanceId, readEntryId, pagesRead, isEntrySelected, handleUpdateReaderBook }: ReadEntryDeleteBarITF) => {

  const [ isDeleteReadEntrySuccess, setIsDeleteReadEntrySuccess ] = useState(false);
  const [ isDeleteReadEntryFail, setIsDeleteReadEntryFail ] = useState(false);

  const toggleReadEntryDeleteSuccessState = () => {
    setIsDeleteReadEntrySuccess(true);
    setIsDeleteReadEntryFail(false);
  };

  const toggleReadEntryDeleteFailState = () => {
    setIsDeleteReadEntrySuccess(false);
    setIsDeleteReadEntryFail(true);
  };

  const resetReadEntryDeleteStates = () => {
    setIsDeleteReadEntrySuccess(false);
    setIsDeleteReadEntryFail(false);
  };

  useEffect(() => {
    !isEntrySelected && resetReadEntryDeleteStates();
  }, [isEntrySelected]);

  const handleDeleteReadEntry = async () => {
    try {
      const response = await fetch(`http://localhost:3000/1/book/read_entry`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId, readInstanceId, readEntryId, readEntryPagesRead: pagesRead })
      });
      if (response.ok) {
        toggleReadEntryDeleteSuccessState();
        const result = await response.json();
        handleUpdateReaderBook(result);
      } else {
        toggleReadEntryDeleteFailState();
      }
    } catch(err) {
      console.error(err);
      toggleReadEntryDeleteFailState();
    }
  };

  const submitHoldTimer = 1000;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleDeleteReadEntry);

  return (
    <div className='relative'>
        <ReadEntryDeleteButton isStartSubmit={isStartSubmit} submitHoldTimer={submitHoldTimer} handleStartSubmit={handleStartSubmit} handleStopSubmit={handleStopSubmit} handleReset={resetReadEntryDeleteStates} />
      <div className='absolute -right-1 top-3'>
        <SuccessIndicator size={13} isSuccess={isDeleteReadEntrySuccess} isFail={isDeleteReadEntryFail} indicatorTransitionTimer={300} />
      </div>
    </div>
  )
};

export default ReadEntryDeleteBar;