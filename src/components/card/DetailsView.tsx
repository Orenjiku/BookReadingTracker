import React, { useState, cloneElement } from 'react';
import tw, { styled, css } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import usePrevious from '../../hooks/usePrevious';
import { BsChevronLeft, BsChevronRight, BsCircleFill } from 'react-icons/bs';


interface DetailsViewPropsITF {
  viewDetails: Array<{ key: string; value: number }>;
}

const ViewHorizontalSlideContainer = styled.div`
  ${tw`absolute h-full w-full flex justify-center`};
  --transition: all 200ms linear;
  &.forward-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  &.forward-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: var(--transition);
  }
  &.forward-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.forward-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: var(--transition);
  }
  &.backward-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  &.backward-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: var(--transition);
  }
  &.backward-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.backward-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: var(--transition);
  }
`;

const ValueDisplay = styled.p<{ $value: number }>`
  ${tw`absolute top-5 text-coolGray-50 text-6xl font-MerriweatherItalic-300`};
  transform-style: preserve-3d;
  &::after {
    content: '${({ $value }) => $value}';
    ${tw`absolute top-0 left-0`};
    pointer-events: none;
    transform-origin: bottom;
    transform: scaleY(-1) translateY(-7%) rotateX(-70deg);
    background: linear-gradient(0deg, #F9FAFB 0%, transparent 60%);
    ${tw`bg-clip-text text-transparent`};
    filter: blur(3px);
  }
  &:hover {
    animation: turn 3000ms linear infinite;
    @keyframes turn {
      0%, 100% { transform: rotateY(0deg); };
      25% { transform: rotateY(40deg); };
      75% { transform: rotateY(-40deg); };
    }
  }
`;

const GradientPane = styled.div<{ $left?: boolean; $right?: boolean }>`
  ${tw`h-full cursor-pointer`};
  min-width: 200%;
  --transition: transform 100ms linear;
  transition: var(--transition);
  ${({ $left }) => $left && css`
    transform: translateX(-50%);
    &::before {
      content: '';
      ${tw`absolute h-full w-1/2 bg-gradient-to-r from-coolGray-300 opacity-50`};
    }
    &:hover {
      transform: translateX(0%);
      transition: var(--transition);
    }
  `}
  ${({ $right }) => $right && css`
    transform: translateX(0%);
    &::before {
      content: '';
      ${tw`absolute right-0 h-full w-1/2 bg-gradient-to-l from-coolGray-300 opacity-50`};
    }
    &:hover {
      transform: translateX(-50%);
      transition: var(--transition);
    }
  `}
`;

const StyledBsCircleFill = styled(BsCircleFill)<{ $selected: boolean }>`
  ${tw`mx-0.5 stroke-current text-coolGray-500`};
  --neon-light-center: #f9fafb;
  --neon-light-color: #0d9488;
  --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                  drop-shadow(0 0 6px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-color))
                  drop-shadow(0 0 8px var(--neon-light-color));
  ${({ $selected }) => $selected
    ? css`
      color: var(--neon-light-center);
      filter: var(--light-effect);
      mix-blend-mode: lighten;
    `
    : css`
      &:hover {
        ${tw`cursor-pointer animate-pulse`};
        color: var(--neon-light-center);
        filter: var(--light-effect);
        mix-blend-mode: lighten;
      }
    `
  }
`;

const DetailsView = ({ viewDetails }: DetailsViewPropsITF) => {
  const [ currIdx, setCurrIdx ] = useState(0);
  const prevIdx = usePrevious(currIdx);
  const length = viewDetails.length;
  const classNames = ((currIdx > prevIdx && currIdx !== prevIdx + (length - 1)) || currIdx === prevIdx - (length - 1)) ? 'forward' : 'backward';
  // const detailsViewRef = useRef(null);

  const nextSlide = () => setCurrIdx((currIdx + 1) % length);
  const prevSlide = () => setCurrIdx((currIdx + length - 1) % length);

  return (
    <div className='relative h-full w-full'>

      <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames})}>
        <CSSTransition timeout={200} key={`view-${currIdx}`} unmountOnExit /* nodeRef={detailsViewRef} */>
          <ViewHorizontalSlideContainer /* ref={detailsViewRef} */>
            <ValueDisplay $value={viewDetails[currIdx].value}>{viewDetails[currIdx].value}</ValueDisplay>
            <div className='absolute text-trueGray-50 text-xl font-AdventPro-400'>{viewDetails[currIdx].key}</div>
          </ViewHorizontalSlideContainer>
        </CSSTransition>
      </TransitionGroup>

      <div className='absolute left-0 h-full w-1/3 flex overflow-hidden'>
        <BsChevronLeft className='absolute top-12 left-0 stroke-current stroke-1 text-coolGray-50' />
        <GradientPane $left onClick={() => prevSlide()} />
      </div>

      <div className='absolute right-0 h-full w-1/3 flex overflow-hidden'>
        <BsChevronRight className='absolute top-12 right-0 stroke-current stroke-1 text-coolGray-50' />
        <GradientPane $right onClick={() => nextSlide()} />
      </div>

      <div className='absolute top-24 left-1/2 transform -translate-x-1/2 mb-1.5 flex'>
        {viewDetails.map((_, i) => (
          <StyledBsCircleFill key={`BsCircleFill-${i}`} size={7} $selected={i === currIdx} {...(i !== currIdx && {onClick: () => setCurrIdx(i)})} />
          ))}
      </div>

    </div>
  )
}

export default DetailsView;