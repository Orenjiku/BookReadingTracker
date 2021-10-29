import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { CgCheckO, CgCloseO } from 'react-icons/cg';


const CgCheckContainer = styled.div<{$isSuccess: boolean; $indicatorTransitionTimer: number}>`
  ${tw`absolute overflow-hidden`};
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  transform-origin: center;
  --flipDuration: ${({ $indicatorTransitionTimer }) => `${$indicatorTransitionTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isSuccess}) => $isSuccess && css`
    transform: rotateX(0);
  `}
`

const CgCloseContainer = styled.div<{$isFail: boolean; $indicatorTransitionTimer: number}>`
  ${tw`absolute overflow-hidden`};
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  transform-origin: center;
  --flipDuration: ${({ $indicatorTransitionTimer }) => `${$indicatorTransitionTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFail}) => $isFail && css`
    transform: rotateX(0deg);
  `}
`

const SuccessIndicator = ({size, isSuccess, isFail, indicatorTransitionTimer}: {size: number; isSuccess: boolean; isFail: boolean; indicatorTransitionTimer: number}) => {
  return (
    <div className='relative flex items-center' style={{transformStyle: 'preserve-3d'}}>
      <CgCheckContainer $isSuccess={isSuccess} $indicatorTransitionTimer={indicatorTransitionTimer}><CgCheckO size={size} className='text-green-600' /></CgCheckContainer>
      <CgCloseContainer $isFail={isFail} $indicatorTransitionTimer={indicatorTransitionTimer}><CgCloseO size={size} className='text-red-600'/></CgCloseContainer>
    </div>
  )
}

export default SuccessIndicator;