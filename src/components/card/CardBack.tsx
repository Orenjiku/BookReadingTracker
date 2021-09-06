import React from 'react';
import tw, { styled, css } from 'twin.macro';

const CardBackContainer = styled.div<{isFlipped: boolean}>`
  ${tw`absolute h-full w-full shadow-xl bg-orange-300 grid place-content-center rounded-2xl`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(180deg);
  transition: transform 600ms linear;
  ${({ isFlipped }) => isFlipped && css`
    transform: perspective(1200px) rotateY(0deg);
  `}
`

const CardBack = ({ isFlipped, handleFlip }: {isFlipped: boolean; handleFlip: Function}) => {
  return (
    <CardBackContainer isFlipped={isFlipped}>
      <button className='h-10 w-40 bg-blueGray-300' onClick={() => handleFlip()} ></button>
    </CardBackContainer>
  )
}

export default CardBack;