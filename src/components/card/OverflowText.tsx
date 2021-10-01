import React, { useState, useRef } from 'react';
import useLeft from '../../hooks/useLeft';
import useOffsetRight from '../../hooks/useOffsetRight';
import { StyledOverflowText } from './styled';


interface TextOverflowPropsITF {
  bookTitle?: true;
  author?: true;
  text: string;
}

const OverflowText = ({ bookTitle, author, text }: TextOverflowPropsITF) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const { offsetRight } = useOffsetRight(ref);
  const { leftPosition } = useLeft(ref);
  const [ isEllipsis, setIsEllipsis ] = useState(true);
  const [ isTranslatingLeft, setIsTranslatingLeft ] = useState(false);

  const handleEllipsis = () => {
    if (!ref.current) return;
    ref.current.getBoundingClientRect().left === leftPosition && setIsEllipsis(true);
  };

  const handleClick = () => {
    setIsTranslatingLeft((isTranslatingLeft) => !isTranslatingLeft);
    setIsEllipsis(false);
  };

  return (
    <StyledOverflowText ref={ref} {...(bookTitle && {bookTitle} || author && {author})} $offsetRight={offsetRight} onClick={handleClick}  onTransitionEnd={handleEllipsis} $isTranslatingLeft={isTranslatingLeft} $isEllipsis={isEllipsis} title={text}>{text}</StyledOverflowText>
  )
}

export default OverflowText;