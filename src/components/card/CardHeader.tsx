import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { StyledText } from './styled';
import OverflowText from './OverflowText';
import useIsXOverflow from '../../hooks/useIsXOverflow';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';


interface CardHeaderPropsITF {
  title: string;
  author: string[];
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

const StyledLeftArrow = styled(LeftArrow)<{ $slideShowTimer: number }>`
  ${tw`min-w-min opacity-40 stroke-current text-coolGray-50 stroke-1 cursor-pointer`};
  --arrow-shadow: drop-shadow(0px 2px 0px black);
  filter: var(--arrow-shadow);
  --duration: ${({ $slideShowTimer }) => `${$slideShowTimer}ms`};
  --neon-light-center: #f9fafb;
  --neon-light-color: #0d9488;
  --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                  drop-shadow(0 0 6px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-center))
                  drop-shadow(0 0 12px var(--neon-light-center))
                  drop-shadow(0 0 16px var(--neon-light-color));
  &:hover {
    ${tw`opacity-60`};
  }
  &.arrow-enter-active {
    filter: none;
    transition: filter calc(var(--duration) * 0.4) linear;
  }
  &.arrow-enter-done {
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: filter calc(var(--duration) * 0.2) linear;
  }
  &.arrow-exit {
    color: var(--neon-light-center);
    filter: var(--light-effect);
  }
  &.arrow-exit-active {
    filter: none;
    transition: filter calc(var(--duration) * 0.2) linear;
  }
  &.arrow-exit-done {
    transition: all calc(var(--duration) * 0.2) linear;
  }
`;

const CardHeader = ({ title, author, isSlideShow, slideShowTimer, handleShowSlideShow }: CardHeaderPropsITF) => {
  const cardHeaderRef = useRef(null);
  const bookTitleRef = useRef<HTMLParagraphElement>(null);
  const bookAuthorRef = useRef<HTMLParagraphElement>(null);

  const { isRefXOverflowing: isTitleOverflow } = useIsXOverflow(bookTitleRef);
  const { isRefXOverflowing: isAuthorOverflow } = useIsXOverflow(bookAuthorRef);

  const [ isArrowAnimating, setIsArrowAnimating ] = useState(false);

  const handleArrowClick = () => {
    handleShowSlideShow();
    setIsArrowAnimating(true);
  };

  return (
    <CardHeaderContainer>

      <div className='-mt-0.5 pl-2 mr-10 flex items-center justify-start'>
        <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='arrow' nodeRef={cardHeaderRef} onEntered={() => setIsArrowAnimating(false)} onExited={() => setIsArrowAnimating(false)}>
          <StyledLeftArrow size={26} ref={cardHeaderRef} $slideShowTimer={slideShowTimer} onClick={() => !isArrowAnimating && handleArrowClick()} />
        </CSSTransition>
        <div className='ml-2 overflow-hidden'>
          {!isTitleOverflow ? <StyledText bookTitle ref={bookTitleRef}>{title}</StyledText> : <OverflowText bookTitle text={title} />}
        </div>
      </div>

      <div className='relative -mt-1.5 ml-2 mr-5 flex justify-end'>
        <div className='ml-16 overflow-hidden'>
          {!isAuthorOverflow ? <StyledText author ref={bookAuthorRef}>{author}</StyledText> : <OverflowText author text={author.join(', ')} />}
        </div>
      </div>

    </CardHeaderContainer>
  )
}

export default CardHeader;