import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { CgCheckO, CgCloseO } from 'react-icons/cg';


const IndicatorContainer = styled.div<{ $indicatorTrigger: boolean; $indicatorTransitionTimer: number }>`
  ${tw`absolute overflow-hidden`};
  backface-visibility: hidden;
  transform: rotateX(-180deg);
  transform-origin: center;
  --flipDuration: ${({ $indicatorTransitionTimer }) => `${$indicatorTransitionTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $indicatorTrigger}) => $indicatorTrigger && css`
    transform: rotateX(0);
  `}
`

const SuccessIndicator = ({size, isSuccess, isFail, indicatorTransitionTimer}: {size: number; isSuccess: boolean; isFail: boolean; indicatorTransitionTimer: number}) => {
  return (
    <div className='relative flex items-center' style={{transformStyle: 'preserve-3d'}}>
      <IndicatorContainer $indicatorTrigger={isSuccess} $indicatorTransitionTimer={indicatorTransitionTimer}>
        <CgCheckO size={size} className='text-green-600' />
      </IndicatorContainer>

      <IndicatorContainer $indicatorTrigger={isFail} $indicatorTransitionTimer={indicatorTransitionTimer}>
        <CgCloseO size={size} className='text-red-600'/>
      </IndicatorContainer>
    </div>
  )
};

export default SuccessIndicator;