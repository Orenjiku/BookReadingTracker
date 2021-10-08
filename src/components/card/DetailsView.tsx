import React, { useState, useRef, cloneElement } from 'react';
import tw, { styled, css } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import usePrevious from '../../hooks/usePrevious';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';
import EditView from './EditView';


interface DetailsViewPropsITF {
  viewDetails: Array<{ key: string; value: number }>;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
}

const DetailsViewContainer = styled.div<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative overflow-hidden`};
  min-height: 38%;
  max-height: 38%;
  --duration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--duration) ease-out;
  ${({ $isExpanded }) => $isExpanded && css`
    min-height: 0;
    max-height: 0;
    transition: all var(--duration) ease-out calc(var(--duration) * 0.2);
  `}
`;

const DetailsViewInnerContainer = styled.div<{ $editTimer: number; $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full bg-blueGray-500 bg-opacity-40 `};
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all calc(var(--duration) * 0.5) linear calc(var(--expandDuration) * 0.8);
  ${({ $isExpanded }) => $isExpanded && css`
    ${tw`opacity-0`};
    transition: all calc(var(--expandDuration) * 0.5) linear;
  `}
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(100%);
  }
  &.slide-enter-active {
    transform: translateY(0);
    transition: transform var(--editDuration) linear;
  }
  &.slide-exit {
    transform: translateY(0);
  }
  &.slide-exit-active {
    transform: translateY(100%);
    transition: transform var(--editDuration) linear;
  }
`;

const ViewContainer = styled.div`
  ${tw`absolute h-full w-full flex justify-center`};
  --duration: 200ms;
  --timing-function: linear;
  --transition: all var(--duration) var(--timing-function);
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
  ${tw`relative h-full cursor-pointer`};
  min-width: 200%;
  --translateXDuration: 100ms;
  --translateXFunction: linear;
  --transition: transform var(--translateXDuration) var(--translateXFunction);
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

const EditViewContainer = styled.div<{ $editTimer: number }>`
  ${tw`absolute top-0 left-0 h-full w-full overflow-hidden`};
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: transform var(--duration) linear;
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: transform var(--duration) linear;
  }
`;

const DetailsView = ({ viewDetails, isEdit, editTimer, isExpanded, expandTimer }: DetailsViewPropsITF) => {
  const detailsViewInnerRef = useRef<HTMLDivElement>(null);
  const editViewRef = useRef<HTMLDivElement>(null);
  const [ currIdx, setCurrIdx ] = useState<number>(0);
  const prevIdx = usePrevious(currIdx);
  const length = viewDetails.length;
  const classNames = ((currIdx > prevIdx && currIdx !== prevIdx + (length - 1)) || currIdx === prevIdx - (length - 1)) ? 'forward' : 'backward';
  // const detailsViewRef = useRef(null);

  const nextSlide = () => setCurrIdx((currIdx + 1) % length);
  const prevSlide = () => setCurrIdx((currIdx + length - 1) % length);

  return (
    <DetailsViewContainer $isExpanded={isExpanded} $expandTimer={expandTimer}>

      <CSSTransition in={!isEdit} timeout={editTimer} classNames='slide' nodeRef={detailsViewInnerRef} unmountOnExit>

        <DetailsViewInnerContainer ref={detailsViewInnerRef} $editTimer={editTimer} $isExpanded={isExpanded} $expandTimer={expandTimer}>
          <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames})}>
            <CSSTransition timeout={200} key={`view-${currIdx}`} unmountOnExit /* nodeRef={detailsViewRef} */>
              <ViewContainer /* ref={detailsViewRef} */>
                <ValueDisplay $value={viewDetails[currIdx].value}>{viewDetails[currIdx].value}</ValueDisplay>
                <div className='absolute text-trueGray-50 text-xl font-AdventPro-400'>{viewDetails[currIdx].key}</div>
              </ViewContainer>
            </CSSTransition>
          </TransitionGroup>

          <div className='absolute left-0 h-full w-1/3 flex items-center overflow-hidden'>
            <BsChevronLeft className='absolute left-0 stroke-current stroke-1 text-coolGray-50' />
            <GradientPane $left onClick={() => prevSlide()} />
          </div>

          <div className='absolute right-0 h-full w-1/3 flex items-center overflow-hidden'>
            <BsChevronRight className='absolute right-0 stroke-current stroke-1 text-coolGray-50' />
            <GradientPane $right onClick={() => nextSlide()} />
          </div>

          <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-1.5 flex'>
            {viewDetails.map((_, i) => (
              <StyledBsCircleFill key={`BsCircleFill-${i}`} size={7} $selected={i === currIdx} {...(i !== currIdx && {onClick: () => setCurrIdx(i)})} />
              ))}
          </div>
        </DetailsViewInnerContainer>

      </CSSTransition>

      <CSSTransition in={isEdit} timeout={editTimer} classNames='slide' nodeRef={editViewRef} unmountOnExit>
        <EditViewContainer ref={editViewRef} $editTimer={editTimer}>
          <EditView />
        </EditViewContainer>
      </CSSTransition>

    </DetailsViewContainer>
  )
}

export default DetailsView;