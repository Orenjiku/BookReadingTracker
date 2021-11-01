import React, { useState } from 'react';
import { StyledButton } from './styled';
import FormLabel from './FormLabel';


const EditView = () => {
  const [ currentDate, setCurrentDate ] = useState(new Date(Date.now()).toISOString().slice(0, 10));
  const [ currentPage, setCurrentPage ] = useState('');
  // const [ percent, setPercent ] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'currentDate') setCurrentDate(e.target.value);
    else if (e.target.name === 'currentPage') setCurrentPage(e.target.value);
  };

  return (
    <div className='h-full w-full'>
      <form className='h-full w-full flex flex-col justify-center items-center border-t border-b border-trueGray-50'>
        <div className='flex justify-center mx-1'>
          <div className='mr-0.5' style={{flexBasis: '66.66%'}}>
            <FormLabel type='input' label='Date' name='currentDate' value={currentDate} placeholder='yyyy-mm-dd' submitStatus={[false, false]} feedbackText={''} handleInputChange={handleInputChange} />
          </div>
          <div className='ml-0.5' style={{flexBasis: '33.33%'}}>
            <FormLabel type='input' label='Page' name='currentPage' value={currentPage} placeholder='#' submitStatus={[false, false]} feedbackText={''} handleInputChange={handleInputChange} />
          </div>
        </div>
        <div className='w-full mt-3 flex justify-center'>
          <StyledButton type='button'>Add</StyledButton>
        </div>
      </form>
    </div>
  )
}

export default EditView;