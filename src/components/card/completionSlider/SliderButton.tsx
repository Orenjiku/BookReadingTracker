import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';


const StyledArrowRightSquare = styled(ArrowRightSquare)<{ $isLightUp: boolean; }>`
  ${tw`stroke-0 stroke-current text-gray-50`};
  transition: all 300ms linear;
  ${({ $isLightUp }) => $isLightUp && css`
    --neon-light-center: #f9fafb;
    --neon-light-color: #0d9488;
    --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                    drop-shadow(0 0 8px var(--neon-light-center))
                    drop-shadow(0 0 16px var(--neon-light-center))
                    drop-shadow(0 0 32px var(--neon-light-color))
                    drop-shadow(0 0 48px var(--neon-light-color))
                    drop-shadow(0 0 72px var(--neon-light-color))
                    drop-shadow(0 0 108px var(--neon-light-color));
    color: var(--neon-light-center);
    filter: var(--light-effect);
  `}
`;

const SliderButton = ({ sliderButtonWidth, isLightUp }: { sliderButtonWidth: number; isLightUp: boolean }) => (
  <div style={{width: `${sliderButtonWidth * 100}%`}} className='z-10 flex justify-center items-center overflow-hidden rounded-b-2xl cursor-pointer'>
    <StyledArrowRightSquare size={23} $isLightUp={isLightUp} />
  </div>
);

export default SliderButton;