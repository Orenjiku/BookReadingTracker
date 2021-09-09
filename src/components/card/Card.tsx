import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { BookITF } from '../../interfaces/interface';
import CardFront from './CardFront';
import CardBack from './CardBack';

const CardContainer = styled.div`
  ${tw`relative m-5`};
  --card-size: 370px;
  min-width: var(--card-size);
  max-width: var(--card-size);
  min-height: var(--card-size);
  max-height: var(--card-size);
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