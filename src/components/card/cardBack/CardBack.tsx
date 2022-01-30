import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { BookDetailsITF } from '../../../interfaces/interface';
import useDelayFalse from '../../../hooks/useDelayFalse';
import CardBackForm from './CardBackForm';


interface CardBackPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  readerBookId: number;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleFlip: Function;
  handleUpdateBookDetails: Function;
  handleUpdateAuthorDetails: Function;
  handleUpdateReaderBook: Function;
}

const CardBackContainer = styled.div<{ $isFlipped: boolean; $flipTimer: number }>`
  ${tw`absolute h-full w-full`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(180deg);
  --flipDuration: ${({ $flipTimer }) => `${$flipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFlipped }) => $isFlipped
    ? css`transform: perspective(1200px) rotateY(0deg);`
    : css`pointer-events: none;`}
`;

const CardBack = ({ bookDetails, author, readerBookId, isFlipped, flipTimer, indicatorTransitionTimer, handleFlip, handleUpdateBookDetails, handleUpdateAuthorDetails, handleUpdateReaderBook }: CardBackPropsITF) => {

  //delay removing back side of Card until flip is completed.
  const isShowDisplay = useDelayFalse(isFlipped, flipTimer);

  return (
    <CardBackContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>
      {isShowDisplay &&
        <CardBackForm bookDetails={bookDetails} author={author} readerBookId={readerBookId} indicatorTransitionTimer={indicatorTransitionTimer} handleFlip={handleFlip} handleUpdateBookDetails={handleUpdateBookDetails} handleUpdateAuthorDetails={handleUpdateAuthorDetails} handleUpdateReaderBook={handleUpdateReaderBook} />
      }
    </CardBackContainer>
  )
}

export default CardBack;