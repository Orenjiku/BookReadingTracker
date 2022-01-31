import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import useCountdown from '../../../hooks/useCountdown';
import SliderButton from './SliderButton';
import TextContainer from './styled';


interface CompletionSliderPropsITF {
  readerBookId: number;
  readInstanceId: number;
  totalPages: number;
  isReading: boolean;
  handleUpdateReaderBook: Function;
};

const SlideContainer = styled.div`
  ${tw`relative h-full w-full rounded-b-2xl border-t border-trueGray-50 overflow-hidden`}
  user-select: none;
`;

const StyledSlider = styled.div<{ $slideTimer: number; $isDragging: boolean; $sliderButtonWidth: number; $offsetLeft: number }>`
  ${tw`absolute h-full w-full flex rounded-b-2xl justify-end`};
  --slideTimer: ${({ $slideTimer }) => `${$slideTimer}ms`};
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
    transition: all var(--slideTimer) linear;
  }
  &.slide-exit {
    transform: translateX(0%);
  }
  &.slide-exit-active {
    transform: translateX(calc(-1 * var(--sliderButtonWidth)));
    transition: all var(--slideTimer) linear;
  }
`;

const CompletionSlider = ({ readerBookId, readInstanceId, totalPages, isReading, handleUpdateReaderBook }: CompletionSliderPropsITF) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [ isDragging, setIsDragging ] = useState(false);
  const [ atEnd, setAtEnd ] = useState(false);
  const relativeSliderLeftStartPosition = useRef(0);
  const relativeSliderLeftBoundedCurrentPosition = useRef(0);
  const mouseDownSliderLeftOffset = useRef(0);
  const sliderButtonWidth = 0.25; //i.e. 25% of the slider width
  const offsetLeft = relativeSliderLeftBoundedCurrentPosition.current - relativeSliderLeftStartPosition.current;

  const holdTimer = 1800;
  const countdownTimeRemaining = useCountdown(holdTimer, atEnd);

  const slideTimer = 300; //match with ReaderBook CSSTransition timeout

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
      relativeSliderLeftCurrentPosition >= 0 ? setAtEnd(true) : setAtEnd(false);
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
    const dateString = `${new Date(Date.now()).toLocaleDateString('zh-Hans-CN')} ${new Date().toTimeString().slice(0, 8)}`;
    try {
      const response = await fetch(`http://localhost:3000/1/book/read_entry`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ readerBookId, readInstanceId, dateString, currentPage: totalPages, totalPages })
      });
      if (response.ok) {
        const result = await response.json();
        handleUpdateReaderBook(result);
        endDrag();
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    countdownTimeRemaining === 0 && handleSubmitComplete();
  }, [countdownTimeRemaining]);
  //---

  return (
    <SlideContainer ref={containerRef}>
      <CSSTransition in={isReading} timeout={slideTimer} classNames='slide' nodeRef={sliderRef} unmountOnExit>
        <StyledSlider ref={sliderRef} $slideTimer={slideTimer} $isDragging={isDragging} $sliderButtonWidth={sliderButtonWidth} $offsetLeft={offsetLeft} onMouseDown={startDrag}>
          <SliderButton sliderButtonWidth={sliderButtonWidth} isLightUp={atEnd} />
        </StyledSlider>
      </CSSTransition>

      {isReading &&
        <div className='h-full w-full flex justify-center items-center'>
          <TextContainer $fadeIn={!isDragging}>Swipe to Complete!</TextContainer>
          <TextContainer $fadeIn={atEnd}>
            <p className='w-20 text-left'>Hold: <span className='text-red-600'>{countdownTimeRemaining}</span></p>
          </TextContainer>
        </div>
      }
    </SlideContainer>
  )
};

export default CompletionSlider;