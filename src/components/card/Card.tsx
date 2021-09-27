import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { BookITF } from '../../interfaces/interface';
import CardFront from './CardFront';
import CardBack from './CardBack';

const CardContainer = styled.div`
  ${tw`relative m-5`};
  --card-width: 360px;
  --card-height: 378px;
  min-width: var(--card-width);
  max-width: var(--card-width);
  min-height: var(--card-height);
  max-height: var(--card-height);
  transform-style: preserve-3d;
`

const Card = ({ book }: { book: BookITF }) => {
  const [ isFlipped, setIsFlipped ] = useState<boolean>(false);

  const handleFlip = () => setIsFlipped(isFlipped => !isFlipped);

  return (
    <CardContainer>
      <CardFront book={book} isFlipped={isFlipped} handleFlip={handleFlip} />
      <CardBack isFlipped={isFlipped} handleFlip={handleFlip} />
    </CardContainer>
  )
}

export default Card;