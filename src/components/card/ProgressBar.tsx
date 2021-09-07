import React from 'react';
import tw, { styled, css } from 'twin.macro';

const InnerBar = styled.div<{ isEditing: boolean, currentPercent: number }>`
  ${tw`h-1/2 rounded-sm bg-teal-500`}
  ${tw`transition-colors duration-500 ease-out`};
  width: ${({ currentPercent }) => `${currentPercent}%`};
  ${({ isEditing }) => isEditing && css`
    ${tw`bg-red-400`}
    ${tw`transition-colors duration-500 ease-out`};
  `};
`

const ProgressBar = ({currentPercent, isEditing}: {currentPercent: number, isEditing: boolean}) => {
  return (
    <div className='h-2 w-full rounded-sm flex items-center bg-coolGray-50'>
      <InnerBar currentPercent={currentPercent} isEditing={isEditing} />
    </div>
  )
}

export default ProgressBar;