import React from 'react';
import tw, { styled, css } from 'twin.macro';


const OuterBar = styled.div`
  ${tw`h-2 w-full rounded-md flex items-center bg-coolGray-50`};
`;

const InnerBar = styled.div<{ isEdit: boolean, $editTimer: number; $currentPercent: number }>`
  ${tw`h-1/2 rounded-sm bg-teal-500`};
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: background-color var(--duration) ease-out;
  width: ${({ $currentPercent }) => `${$currentPercent}%`};
  ${({ isEdit }) => isEdit && css`
    ${tw`bg-red-400`};
    transition: background-color var(--duration) ease-out;
  `}
`;

const ProgressBar = ({ currentPercent, isEdit, editTimer }: { currentPercent: number, isEdit: boolean, editTimer: number }) => {
  return (
    <OuterBar>
      <InnerBar $currentPercent={currentPercent} isEdit={isEdit} $editTimer={editTimer} />
    </OuterBar>
  )
};

export default ProgressBar;