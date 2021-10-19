import React, { useState, useEffect, useRef } from 'react';
import useLeft from '../../hooks/useLeft';
import useOffsetRight from '../../hooks/useOffsetRight';
import useIsXOverflow from '../../hooks/useIsXOverflow';
import { StyledOverflowText } from './styled';


interface TextOverflowPropsITF {
  isTitle?: true;
  isAuthor?: true;
  text: string;
  isFlipped: boolean;
  flipTimer: number;
  handleIsOverflow: Function;
}

const OverflowText = ({ isTitle, isAuthor, text, isFlipped, flipTimer, handleIsOverflow }: TextOverflowPropsITF) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const triggers = {isFlipped, flipTimer};
  const leftPosition = useLeft(containerRef, triggers); //leftPosition reference for textRef.
  const offsetRight = useOffsetRight(textRef, triggers); //length in pixels of the overflow section (scrollWidth - clientWidth) of textRef.

  const [ isEllipsis, setIsEllipsis ] = useState(true);
  const [ isTranslatingLeft, setIsTranslatingLeft ] = useState(false);

  const handleEllipsis = () => {
    if (!textRef.current) return;
    textRef.current.getBoundingClientRect().left === leftPosition && setIsEllipsis(true);
  };

  const handleClick = () => {
    setIsTranslatingLeft(isTranslatingLeft => !isTranslatingLeft);
    setIsEllipsis(false);
  };

  //check if textRef is overflow based on a trigger (text) and executes isOverflow function to update parent component's isTitleOverflow or isAuthorOverflow.
  useIsXOverflow(textRef, text, handleIsOverflow);

  //reset leftPosition of textRef to initial leftPosition when flipping to CardBack.
  useEffect(() => {
    if (!textRef.current) return;

    let delayTiming: ReturnType<typeof setTimeout>;
    if (isFlipped) {
      delayTiming = setTimeout(() => {
        if (textRef.current) textRef.current.style.left = `${leftPosition}px`;
        setIsTranslatingLeft(false);
        setIsEllipsis(true);
      }, flipTimer / 2);
    }

    return () => clearTimeout(delayTiming);
  }, [isFlipped]);

  return (
    <div ref={containerRef}>
      <StyledOverflowText ref={textRef} {...(isTitle && {$isTitle: isTitle} || isAuthor && {$isAuthor: isAuthor})} $isTranslatingLeft={isTranslatingLeft} $isEllipsis={isEllipsis} $offsetRight={offsetRight} $isFlipped={isFlipped} onClick={handleClick} onTransitionEnd={handleEllipsis} title={text}>
        {text}
      </StyledOverflowText>
    </div>
  )
}

export default OverflowText;