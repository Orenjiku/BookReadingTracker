import React, { useState, useEffect } from 'react';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import { SaveButton } from './styled';
import { isValidDate } from './utils';
import FormLabel from './FormLabel';


interface EditViewPropsITF {
  readerBookId: number;
  readInstanceId: number;
  totalPages: number;
  isEdit: boolean;
  handleUpdateReaderBook: Function;
}

const EditView = ({ readerBookId, readInstanceId, totalPages, isEdit, handleUpdateReaderBook }: EditViewPropsITF) => {
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

  useEffect(() => {
    if (!isEdit) {
      setReadEntryDate(new Date(Date.now()).toISOString().slice(0, 10));
      setReadEntryCurrentPage('');
      resetReadEntrySubmitStates();
    }
  }, [isEdit])

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

  const submitHoldTimer = 500;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleSubmitReadEntry);

  return (
    <div className='h-full w-full'>
      <form className='h-full w-full flex flex-col justify-center items-center'>
        <div className='flex justify-center mx-1'>
          <div className='mr-0.5' style={{flexBasis: '66.66%'}}>
            <FormLabel type='text' label='Date' name='readEntryDate' value={readEntryDate} placeholder='yyyy-mm-dd' submitStatus={[isSubmitReadEntrySuccess, isSubmitReadEntryFail]} feedbackText='' handleInputChange={handleInputChange} />
          </div>
          <div className='ml-0.5' style={{flexBasis: '33.33%'}}>
            <FormLabel type='number' label='Page' name='readEntryCurrentPage' value={readEntryCurrentPage} placeholder='#' submitStatus={[isSubmitReadEntrySuccess, isSubmitReadEntryFail]} feedbackText='' handleInputChange={handleInputChange} />
          </div>
        </div>
        <div className='w-full mt-3 flex justify-center'>
        <SaveButton type='button' $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={() => handleStartSubmit()} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>Add</SaveButton>
        </div>
      </form>
    </div>
  )
}

export default EditView;