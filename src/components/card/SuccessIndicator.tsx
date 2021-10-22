import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { CgCheckO, CgCloseO } from 'react-icons/cg';


const CgCheckContainer = styled.div<{$isSuccess: boolean; $indicatorFlipTimer: number}>`
  ${tw`absolute overflow-hidden`};
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  transform-origin: center;
  --flipDuration: ${({ $indicatorFlipTimer }) => `${$indicatorFlipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isSuccess}) => $isSuccess && css`
    transform: rotateX(0);
    transition: transform var(--flipDuration) linear;
  `}
`

const CgCloseContainer = styled.div<{$isFail: boolean; $indicatorFlipTimer: number}>`
  ${tw`absolute overflow-hidden`};
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  transform-origin: center;
  --flipDuration: ${({ $indicatorFlipTimer }) => `${$indicatorFlipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFail}) => $isFail && css`
    transform: rotateX(0deg);
    transition: transform var(--flipDuration) linear;
  `}
`

const SuccessIndicator = ({size, isSuccess, isFail, indicatorFlipTimer}: {size: number; isSuccess: boolean; isFail: boolean; indicatorFlipTimer: number}) => {
  return (
    <div className='relative' style={{transformStyle: 'preserve-3d'}}>
      <CgCheckContainer $isSuccess={isSuccess} $indicatorFlipTimer={indicatorFlipTimer}><CgCheckO size={size} className='text-green-600' /></CgCheckContainer>
      <CgCloseContainer $isFail={isFail} $indicatorFlipTimer={indicatorFlipTimer}><CgCloseO size={size} className='text-red-600'/></CgCloseContainer>
    </div>
  )
}

export default SuccessIndicator;