import React, { useState, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';


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

const ArrowButton = ({ isSlideShow, slideShowTimer, handleShowSlideShow}: { isSlideShow: boolean; slideShowTimer: number; handleShowSlideShow: Function }) => {

  const [ isArrowAnimating, setIsArrowAnimating ] = useState(false); //handle arrow click and prevent click event during slideShow transition sequence.
  const arrowButtonRef = useRef(null);

  const handleArrowClick = () => {
    handleShowSlideShow();
    setIsArrowAnimating(true);
  };

  const handleStopArrowClick = () => setIsArrowAnimating(false);

  const handleClick = () => !isArrowAnimating && handleArrowClick();

  return (
    <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='arrow' nodeRef={arrowButtonRef} onEntered={handleStopArrowClick} onExited={handleStopArrowClick}>
      <StyledLeftArrow size={26} ref={arrowButtonRef} $slideShowTimer={slideShowTimer} onClick={handleClick} />
    </CSSTransition>
  )
};

export default ArrowButton;