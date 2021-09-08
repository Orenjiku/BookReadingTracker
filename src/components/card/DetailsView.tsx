import React, { useState } from 'react';
import usePrevious from '../../hooks/usePrevious';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';
import tw, { styled, css } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface DetailsViewITF {
  readDetails: {
    key:string;
    value:number;
  }[];
}

const AnimatedChevronContainer = styled.div<{left?: boolean; right?: boolean;}>`
  ${tw`absolute h-full w-1/6 cursor-pointer`};
  ${tw`transition duration-300 ease-in`};
  &:hover {
    ${tw`bg-trueGray-50 bg-opacity-40 transition-all duration-500 ease-in-out`};
  };
  ${({ left }) => left && css`${tw`left-0 flex items-center justify-start`}`};
  ${({ right }) => right && css`${tw`right-0 flex items-center justify-end`}`};
`

const AnimatedBsCircleFill = styled(BsCircleFill)<{selected: boolean}>`
  ${tw`mx-0.5 fill-current text-coolGray-50 cursor-pointer`};
  ${({ selected }) => selected
    ? css`${tw`fill-current text-teal-600`}`
    : css`&:hover {
      ${tw`fill-current text-teal-600 animate-pulse`};
    }`
  }
`

const ViewContainer = styled.div<{prev: number; curr: number}>`
  ${tw`absolute h-full w-full grid place-items-center`};
  &.fade-enter {
    opacity: 0;
    transform: ${({ prev, curr }) => ((prev < curr && prev !== curr - 5) || prev === curr + 5) ? css`translateX(100%)` : css`translateX(-100%)`};
  }
  &.fade-enter-active {
    opacity: 1;
    transform: translateX(0%);
    transition: all 200ms linear;
  }
  &.fade-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.fade-exit-active {
    opacity: 0;
    transform: ${({ prev, curr }) => ((prev < curr && prev !== curr - 5) || prev === curr + 5) ? css`translateX(-100%)` : css`translateX(100%)`};
    transition: all 200ms linear;
  }
`

const DetailsView = ({ readDetails }: DetailsViewITF) => {
  const [current, setCurrent] = useState<number>(0);

  const prev = usePrevious(current);
  const length = readDetails.length;

  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 bg-blueGray-300 overflow-hidden'>

      <TransitionGroup component={null}>
        <CSSTransition classNames='fade' timeout={200} key={current}>
          <ViewContainer prev={prev} curr={current}>
            <div className='absolute text-coolGray-50 text-7.5xl font-SortsMillGoudy-400'>{readDetails[current].value}</div>
            <div className='absolute text-trueGray-900 text-2xl font-AdventPro-400'>{readDetails[current].key}</div>
          </ViewContainer>
        </CSSTransition>
      </TransitionGroup>

      <div className='absolute bottom-0 w-full mb-1.5 flex justify-center'>
        {readDetails.map((_, i) => (
          (i === current)
          ? <AnimatedBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={true} />
          : <AnimatedBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={false} onClick={() => setCurrent(i)} />
        ))}
      </div>

      <AnimatedChevronContainer left onClick={() => prevSlide()}>
        <BsChevronLeft />
      </AnimatedChevronContainer>
      <AnimatedChevronContainer right onClick={() => nextSlide()}>
        <BsChevronRight />
      </AnimatedChevronContainer>


    </div>
  )
}

export default DetailsView;