import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { CgPushChevronDownR } from 'react-icons/cg';
import { Trash } from '@styled-icons/bootstrap/Trash';


interface ReadEntryDeletionButtonITF  {
  isStartSubmit: boolean;
  submitHoldTimer: number;
  handleStartSubmit: Function;
  handleStopSubmit: Function;
  handleReset: Function;
};

const DeleteButton = styled.button<{ $isStartSubmit: boolean, $submitHoldTimer: number }>`
  ${tw`px-1.5 rounded flex justify-center items-center`};
  ${tw`bg-red-400 text-trueGray-50 text-sm font-AdventPro-200`};
  height: 26px;
  ${tw`transition-colors duration-200 ease-linear`};
  --duration: ${({ $submitHoldTimer }) => `${$submitHoldTimer}ms`};
  ${({ $isStartSubmit }) => $isStartSubmit && css`
    ${tw`bg-red-500`};
    transition: all var(--duration) ease-in-out;
  `}
`;

const ReadEntryDeleteButton = ({ isStartSubmit, submitHoldTimer, handleStartSubmit, handleStopSubmit, handleReset }: ReadEntryDeletionButtonITF) => {

  const handleMouseDown = () => {
    handleReset();
    handleStartSubmit();
  };

  return (
    <DeleteButton $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={handleMouseDown} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>
      <Trash size={13} />
      <p className='mx-1'>{`Hold for ${submitHoldTimer / 1000} second`}</p>
      <CgPushChevronDownR />
    </DeleteButton>
  )
};

export default ReadEntryDeleteButton;