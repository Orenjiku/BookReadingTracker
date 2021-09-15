import React, { useState, cloneElement } from 'react';
import tw, { styled, css } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import usePrevious from '../../hooks/usePrevious';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';

const ViewContainer = styled.div`
  ${tw`absolute h-full w-full flex justify-center`};
  &.forward-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  &.forward-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 200ms linear;
  }
  &.forward-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.forward-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: all 200ms linear;
  }
  &.backward-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  &.backward-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 200ms linear;
  }
  &.backward-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.backward-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: all 200ms linear;
  }
`

const ValueContainer = styled.div<{value: number}>`
  ${tw`absolute h-full top-5 text-coolGray-50 text-6xl font-MerriweatherItalic-300`};
  transform-style: preserve-3d;
  &:hover {
    animation: turn 3000ms linear infinite;
    @keyframes turn {
      0%, 100% {
        transform: rotateY(0deg);
      }
      25% {
        transform: rotateY(50deg);
      }
      75% {
        transform: rotateY(-50deg);
      }
    }
  }
  &::after {
    content: '${({value}) => `${value}`}';
    ${tw`absolute top-0 left-0`};
    background: linear-gradient(0deg, #F9FAFB 0%, transparent 60%);
    transform-origin: bottom;
    transform: scaleY(-1) translateY(-7%) rotateX(-70deg);
    ${tw`bg-clip-text text-transparent`};
    filter: blur(3px);
  }
`

const StyledBsCircleFill = styled(BsCircleFill)<{selected: boolean}>`
  ${tw`mx-0.5 fill-current text-coolGray-500 cursor-pointer`};
  --neon-light-color: #0D9488;
  --light-effect: drop-shadow(0 0 4px #fff)
                  drop-shadow(0 0 6px #fff)
                  drop-shadow(0px 0px 8px var(--neon-light-color))
                  drop-shadow(0px 0px 8px var(--neon-light-color));
  ${({ selected }) => selected
    ? css`
      ${tw`fill-current text-coolGray-50`};
      filter: var(--light-effect);
    `
    : css`
      &:hover {
        ${tw`fill-current text-coolGray-50 animate-pulse`};
        filter: var(--light-effect);
      }
    `
  }
`

const StyledChevronContainer = styled.div<{left?: boolean; right?: boolean;}>`
  ${tw`relative h-full cursor-pointer`};
  min-width: 200%;
  --translateXTiming: 300ms;
  transition: transform var(--translateXTiming) ease-in-out;
  ${({ left }) => left && css`
    transform: translateX(-50%);
    &::before {
      content: '';
      ${tw`absolute h-full w-1/2 bg-gradient-to-r from-coolGray-300 opacity-50`};
    }
    &:hover {
      transform: translateX(0%);
      transition: transform var(--translateXTiming) ease-in-out;
    };
  `};
  ${({ right }) => right && css`
    transform: translateX(0%);
    &::before {
      content: '';
      ${tw`absolute right-0 h-full w-1/2 bg-gradient-to-l from-coolGray-300 opacity-50`};
    }
    &:hover {
      transform: translateX(-50%);
      transition: transform var(--translateXTiming) ease-in-out;
    };
  `};
`

const DetailsView = ({ readDetails }: { readDetails: Array<{ key:string; value:number }> }) => {
  const [currIdx, setCurrIdx] = useState<number>(0);
  const prevIdx = usePrevious(currIdx);
  const length = readDetails.length;
  const classNames = ((currIdx > prevIdx && currIdx !== prevIdx + (length - 1)) || currIdx === prevIdx - (length - 1)) ? 'forward' : 'backward';
  // const detailsViewRef = useRef(null);

  const nextSlide = () => setCurrIdx((currIdx + 1) % length);
  const prevSlide = () => setCurrIdx((currIdx + length - 1) % length);

  return (
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 bg-blueGray-500 bg-opacity-40 overflow-hidden'>

      <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames})}>
        <CSSTransition timeout={200} key={`ReadDetails-${currIdx}`} /* nodeRef={detailsViewRef} */>
          <ViewContainer /* ref={detailsViewRef} */>
            <ValueContainer value={readDetails[currIdx].value}>{readDetails[currIdx].value}</ValueContainer>
            <div className='absolute text-trueGray-50 text-xl font-AdventPro-400'>{readDetails[currIdx].key}</div>
          </ViewContainer>
        </CSSTransition>
      </TransitionGroup>

      <div className='absolute h-full w-full flex justify-between'>
        <div className='h-full w-1/3 flex items-center overflow-hidden'>
          <BsChevronLeft className='absolute left-0 stroke-current stroke-1 text-coolGray-50'/>
          <StyledChevronContainer left onClick={() => prevSlide()} />
        </div>
        <div className='h-full w-1/3 flex items-center overflow-hidden'>
          <BsChevronRight className='absolute right-0 stroke-current stroke-1 text-coolGray-50' />
          <StyledChevronContainer right onClick={() => nextSlide()} />
        </div>
      </div>

      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1.5 flex'>
        {readDetails.map((_, i) => (
          <StyledBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={i === currIdx} {...(i !== currIdx && {onClick: () => setCurrIdx(i)})}/>
        ))}
      </div>

    </div>
  )
}

export default DetailsView;