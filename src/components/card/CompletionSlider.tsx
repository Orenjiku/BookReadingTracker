import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';


const SlideContainer = styled.div`
  ${tw`relative h-full w-full rounded-b-2xl border-t border-trueGray-50 overflow-hidden`}
  user-select: none;
`

const StyledSlider = styled.div<{ $isDragging: boolean; $sliderButtonWidth: number; $offsetLeft: number }>`
  ${tw`absolute h-full w-full flex rounded-b-2xl justify-center items-center cursor-pointer`};
  left: calc((${({ $sliderButtonWidth }) => $sliderButtonWidth} - 1) * 100%);
  --sliderWithoutButtonWidth: calc((1 - (${({ $sliderButtonWidth }) => $sliderButtonWidth})) * 100%);
  background: linear-gradient(90deg, #059669 0, transparent var(--sliderWithoutButtonWidth));
  ${({ $isDragging, $offsetLeft }) => !$isDragging && css`
    --rate: 1000;
    --duration: calc(${$offsetLeft} / var(--rate) * 1s);
    transition: left var(--duration) ease-out;
  `}
  &::after {
    content: '';
    ${tw`absolute right-0 h-full rounded-b-2xl bg-blueGray-500 bg-opacity-40`};
    width: calc(${({ $sliderButtonWidth }) => $sliderButtonWidth} * 100%);
  }
  &.slide-enter {
    transform: translateX(calc(${({ $sliderButtonWidth }) => $sliderButtonWidth} * -100%));
  }
  &.slide-enter-active {
    transform: translateX(0%);
    transition: all 300ms linear;
  }
  &.slide-exit {
    transform: translateX(0%);
  }
  &.slide-exit-active {
    transform: translateX(calc(${({ $sliderButtonWidth }) => $sliderButtonWidth} * -100%));
    transition: all 300ms linear;
  }
`;

const CompletionSlider = ({ isReading }: { isReading: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [ isDragging, setIsDragging ] = useState(false);
  const [ atEnd, setAtEnd ] = useState(false);

  const relativeSliderLeftStartPosition = useRef(0);
  const relativeSliderLeftBoundedCurrentPosition = useRef(0);
  const mouseDownSliderLeftOffset = useRef(0);

  const sliderButtonWidth = 0.25;
  const offsetLeft = relativeSliderLeftBoundedCurrentPosition.current - relativeSliderLeftStartPosition.current;

  useEffect(() => {
    if (containerRef.current) {
      relativeSliderLeftStartPosition.current = containerRef.current.clientWidth * (sliderButtonWidth - 1);
    }
    window.addEventListener('mouseup', endDrag)
  }, []);

  useEffect(() => {
    window.onmousemove = isDragging ? onDrag : null;
  }, [isDragging]);

  useEffect(() => {
    console.log('atEnd:', atEnd)
    //Add effects
  }, [atEnd]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderLeftStartPosition = e.currentTarget.getBoundingClientRect().left;
    mouseDownSliderLeftOffset.current = e.clientX - sliderLeftStartPosition;
    setIsDragging(true);
  };

  const onDrag = (e: MouseEvent) => {
    if (sliderRef.current && containerRef.current && isDragging) {
      const containerLeftPosition = containerRef.current ? containerRef.current.getBoundingClientRect().left : 0;
      const relativeSliderLeftCurrentPosition = (e.clientX - containerLeftPosition) - mouseDownSliderLeftOffset.current;
      relativeSliderLeftBoundedCurrentPosition.current = Math.min(Math.max(relativeSliderLeftStartPosition.current, relativeSliderLeftCurrentPosition), 0);
      sliderRef.current.style.left = `${relativeSliderLeftBoundedCurrentPosition.current}px`;
      if (relativeSliderLeftCurrentPosition >= 0) setAtEnd(true);
      else setAtEnd(false);
    }
  };

  const endDrag = () => {
    setAtEnd(false);
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.left = `${relativeSliderLeftStartPosition.current}px`;
    }
  };

  return (
    <SlideContainer ref={containerRef}>
      <CSSTransition in={isReading} timeout={300} classNames='slide' nodeRef={sliderRef} unmountOnExit>
        <StyledSlider ref={sliderRef} $isDragging={isDragging} $sliderButtonWidth={sliderButtonWidth} $offsetLeft={offsetLeft} onMouseDown={startDrag}>
          <div style={{width: `${sliderButtonWidth * 100}%`}} className='absolute h-full right-0 flex justify-center items-center'>
            <ArrowRightSquare style={{height:'22px', width: '30px'}} className='z-10 stroke-0 stroke-current text-gray-50' />
          </div>
        </StyledSlider>
      </CSSTransition>
    </SlideContainer>
  )
}

export default CompletionSlider;