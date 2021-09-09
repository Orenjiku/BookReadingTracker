import React, { useState, cloneElement } from 'react';
import tw, { styled, css } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import usePrevious from '../../hooks/usePrevious';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';

const ViewContainer = styled.div`
  ${tw`absolute h-full w-full grid place-items-center`};
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

const StyledBsCircleFill = styled(BsCircleFill)<{selected: boolean}>`
  ${tw`mx-0.5 fill-current text-coolGray-50 cursor-pointer`};
  ${({ selected }) => selected
    ? css`${tw`fill-current text-teal-600`}`
    : css`&:hover {
      ${tw`fill-current text-teal-600 animate-pulse`};
    }`
  }
`

const StyledChevronContainer = styled.div<{left?: boolean; right?: boolean;}>`
  ${tw`absolute h-full w-1/6 cursor-pointer`};
  ${tw`transition duration-300 ease-in`};
  ${({ left }) => left && css`${tw`left-0 flex items-center justify-start`}`};
  ${({ right }) => right && css`${tw`right-0 flex items-center justify-end`}`};
  &:hover {
    ${tw`bg-trueGray-50 bg-opacity-40 transition duration-300 ease-in-out`};
  };
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
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 bg-blueGray-300 overflow-hidden'>

      <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames})}>
        <CSSTransition timeout={200} key={`ReadDetails-${currIdx}`} /* nodeRef={detailsViewRef} */>
          <ViewContainer /* ref={detailsViewRef} */>
            <div className='absolute text-coolGray-50 text-7.5xl font-SortsMillGoudy-400'>{readDetails[currIdx].value}</div>
            <div className='absolute text-trueGray-900 text-2xl font-AdventPro-400'>{readDetails[currIdx].key}</div>
          </ViewContainer>
        </CSSTransition>
      </TransitionGroup>

      <div className='absolute bottom-0 w-full mb-1.5 flex justify-center'>
        {readDetails.map((_, i) => (
          <StyledBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={i === currIdx} {...(i !== currIdx && {onClick: () => setCurrIdx(i)})}/>
        ))}
      </div>

      <StyledChevronContainer left onClick={() => prevSlide()}><BsChevronLeft /></StyledChevronContainer>
      <StyledChevronContainer right onClick={() => nextSlide()}><BsChevronRight /></StyledChevronContainer>

    </div>
  )
}

export default DetailsView;