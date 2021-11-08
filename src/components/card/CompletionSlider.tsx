import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import useCountdown from '../../hooks/useCountdown';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';


interface CompletionSliderPropsITF {
  readerBookId: number;
  readInstanceId: number;
  totalPages: number;
  isReading: boolean;
  handleUpdateReaderBook: Function;
}

const SlideContainer = styled.div`
  ${tw`relative h-full w-full rounded-b-2xl border-t border-trueGray-50 overflow-hidden`}
  user-select: none;
`

const StyledSlider = styled.div<{ $isDragging: boolean; $sliderButtonWidth: number; $offsetLeft: number }>`
  ${tw`absolute h-full w-full flex rounded-b-2xl justify-end`};
  --sliderButtonWidth: ${({ $sliderButtonWidth }) => `${$sliderButtonWidth * 100}%`};
  --sliderWithoutButtonWidth: calc(100% - var(--sliderButtonWidth));
  left: calc(-1 * var(--sliderWithoutButtonWidth));
  ${({ $isDragging, $offsetLeft }) => !$isDragging && css`
    --rate: 1000;
    --duration: calc(${$offsetLeft} / var(--rate) * 1s);
    transition: left var(--duration) ease-out;
  `}
  &::after {
    content: '';
    ${tw`absolute right-0 h-full rounded-b-2xl bg-blueGray-500 bg-opacity-40`};
    width: var(--sliderButtonWidth);
  }
  &.slide-enter {
    transform: translateX(calc(-1 * var(--sliderButtonWidth)));
  }
  &.slide-enter-active {
    transform: translateX(0%);
    transition: all 300ms linear;
  }
  &.slide-exit {
    transform: translateX(0%);
  }
  &.slide-exit-active {
    transform: translateX(calc(-1 * var(--sliderButtonWidth)));
    transition: all 300ms linear;
  }
`;

const StyledArrowRightSquare = styled(ArrowRightSquare)<{ $atEnd: boolean; }>`
  ${tw`stroke-0 stroke-current text-gray-50`}
  transition: all 300ms linear;
  ${({ $atEnd }) => $atEnd && css`
    --neon-light-center: #f9fafb;
    --neon-light-color: #0d9488;
    --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                    drop-shadow(0 0 8px var(--neon-light-center))
                    drop-shadow(0 0 16px var(--neon-light-center))
                    drop-shadow(0 0 32px var(--neon-light-color))
                    drop-shadow(0 0 48px var(--neon-light-color))
                    drop-shadow(0 0 72px var(--neon-light-color))
                    drop-shadow(0 0 108px var(--neon-light-color));
    color: var(--neon-light-center);
    filter: var(--light-effect);
  `}
`;

const TextContainer = styled.div`
  ${tw`h-full flex justify-center items-center font-Charm-400 text-lg`};
  &.fade-enter {
    opacity: 0;
  }
  &.fade-enter-active {
    opacity: 1;
    transition: opacity 100ms linear 250ms;
  }
  &.fade-exit {
    opacity: 1;
  }
  &.fade-exit-active {
    opacity: 0;
    transition: opacity 30ms linear;
  }
`;

const CompletionSlider = ({ readerBookId, readInstanceId, totalPages, isReading, handleUpdateReaderBook }: CompletionSliderPropsITF) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const swipeTextRef = useRef<HTMLDivElement>(null);
  const countdownTextRef = useRef<HTMLDivElement>(null);

  const [ isDragging, setIsDragging ] = useState(false);
  const [ atEnd, setAtEnd ] = useState(false);
  const relativeSliderLeftStartPosition = useRef(0);
  const relativeSliderLeftBoundedCurrentPosition = useRef(0);
  const mouseDownSliderLeftOffset = useRef(0);
  const sliderButtonWidth = 0.25;
  const offsetLeft = relativeSliderLeftBoundedCurrentPosition.current - relativeSliderLeftStartPosition.current;

  const holdTimer = 1800;
  const countdownTimeRemaining = useCountdown(holdTimer, atEnd);

  useEffect(() => {
    if (containerRef.current) {
      relativeSliderLeftStartPosition.current = containerRef.current.clientWidth * (sliderButtonWidth - 1);
    }
    window.addEventListener('mouseup', endDrag);
    return () => window.removeEventListener('mouseup', endDrag);
  }, []);

  useEffect(() => {
    window.onmousemove = isDragging ? onDrag : null;
  }, [isDragging]);

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

  //submit 100% completed read_entry when countdown hits 0.
  const handleSubmitComplete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/1/book/read_entry`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId, readInstanceId, dateString: new Date(Date.now()).toISOString().slice(0, 10), currentPage: totalPages, totalPages })
      });
      if (response.ok) {
        const result = await response.json();
        handleUpdateReaderBook(result);
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    countdownTimeRemaining === 0 && handleSubmitComplete();
  }, [countdownTimeRemaining])
  //---

  return (
    <SlideContainer ref={containerRef}>
      <CSSTransition in={isReading} timeout={300} classNames='slide' nodeRef={sliderRef} unmountOnExit>
        <StyledSlider ref={sliderRef} $isDragging={isDragging} $sliderButtonWidth={sliderButtonWidth} $offsetLeft={offsetLeft} onMouseDown={startDrag}>
          <div style={{width: `${sliderButtonWidth * 100}%`}} className='z-10 flex justify-center items-center overflow-hidden rounded-b-2xl cursor-pointer'>
            <StyledArrowRightSquare size={23} $atEnd={atEnd} />
          </div>
        </StyledSlider>
      </CSSTransition>

      <CSSTransition in={isReading && !isDragging} timeout={300} classNames='fade' nodeRef={swipeTextRef} unmountOnExit>
        <TextContainer ref={swipeTextRef}>Swipe to Complete!</TextContainer>
      </CSSTransition>

      <CSSTransition in={isReading && atEnd} timeout={300} classNames='fade' nodeRef={countdownTextRef} unmountOnExit>
        <TextContainer ref={countdownTextRef}>
          <p className='w-20 text-left'>Hold: <span className='text-red-600'>{countdownTimeRemaining}</span></p>
        </TextContainer>
      </CSSTransition>
    </SlideContainer>
  )
}

export default CompletionSlider;