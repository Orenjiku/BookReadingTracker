import React from 'react';
import tw, { styled, css } from 'twin.macro';

const InnerBar = styled.div<{ isUpdating: boolean, currentPercent: number }>`
  ${tw`h-1/2 rounded-sm bg-teal-500`};
  width: ${({ currentPercent }) => `${currentPercent}%`};
  transition: all 600ms ease-out;
  ${({ isUpdating }) => isUpdating && css`
    ${tw`bg-red-400`};
    transition: all 600ms ease-out;
    animation: pulse 2s ease-out infinite;
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .7;
      }
  `};
`

const ProgressBar = ({currentPercent, isUpdating}: {currentPercent: number, isUpdating: boolean}) => {
  return (
    <div className='flex items-center h-2 w-full rounded-sm bg-coolGray-50'>
      <InnerBar isUpdating={isUpdating} currentPercent={currentPercent} />
    </div>
  )
}

export default ProgressBar;