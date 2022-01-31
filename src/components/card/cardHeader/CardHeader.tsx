import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import useIsXOverflow from '../../../hooks/useIsXOverflow';
import { StyledText } from './styled';
import ArrowButton from './ArrowButton';
import OverflowText from './OverflowText';


interface CardHeaderPropsITF {
  title: string;
  author: string[];
  isFlipped: boolean;
  flipTimer: number;
  isSlideShow: boolean;
  slideShowTimer: number;
  handleShowSlideShow: Function;
}

const CardHeaderContainer = styled.div`
  ${tw`relative col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl overflow-hidden`};
  &::before {
    content: '';
    ${tw`absolute top-0 left-0 w-full h-full opacity-70`};
    background: linear-gradient(#dbeafe 0, transparent 25%);
  }
`;

const CardHeader = ({ title, author, isFlipped, flipTimer, isSlideShow, slideShowTimer, handleShowSlideShow }: CardHeaderPropsITF) => {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  const [ isTitleOverflow, setIsTitleOverflow ] = useState(false);
  const [ isAuthorOverflow, setIsAuthorOverflow ] = useState(false);

  const handleIsTitleOverflow = (input: boolean) => setIsTitleOverflow(input);
  const handleIsAuthorOverflow = (input: boolean) => setIsAuthorOverflow(input);

  //checks if titleRef or authorRef is overflow based on a trigger (title or author) and executes isOverflow function to update isTitleOverflow or isAuthorOverflow.
  useIsXOverflow(titleRef, title, handleIsTitleOverflow);
  useIsXOverflow(authorRef, author, handleIsAuthorOverflow);

  return (
    <CardHeaderContainer>

      <div className='-mt-0.5 pl-2 mr-10 flex items-center justify-start'>
        <ArrowButton isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleShowSlideShow={handleShowSlideShow} />

        <div className='ml-2 overflow-hidden'>
          {!isTitleOverflow ? <StyledText $isTitle ref={titleRef}>{title}</StyledText> : <OverflowText isFlipped={isFlipped} flipTimer={flipTimer} handleIsOverflow={handleIsTitleOverflow} isTitle text={title} />}
        </div>
      </div>

      <div className='relative -mt-1.5 ml-2 mr-5 flex justify-end'>
        <div className='ml-16 overflow-hidden'>
          {!isAuthorOverflow ? <StyledText $isAuthor ref={authorRef}>{author.join(', ')}</StyledText> : <OverflowText isFlipped={isFlipped} flipTimer={flipTimer} handleIsOverflow={handleIsAuthorOverflow} isAuthor text={author.join(', ')} />}
        </div>
      </div>

    </CardHeaderContainer>
  )
};

export default CardHeader;