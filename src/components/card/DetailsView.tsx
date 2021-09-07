import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';
import tw, { styled, css } from 'twin.macro';

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
  ${({ left }) => left && css`${tw`left-0`}`};
  ${({ right }) => right && css`${tw`right-0`}`};
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

const DetailsView = ({ readDetails }: DetailsViewITF) => {
  const [current, setCurrent] = useState<number>(0);

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 flex justify-center items-center bg-blueGray-300 overflow-hidden text-sm font-SortsMillGoudy-400'>

      <div className='absolute text-coolGray-50 text-7.5xl'>{readDetails[current].value}</div>
      <div className='absolute text-trueGray-900 text-2xl font-AdventPro-400'>{readDetails[current].key}</div>

      <AnimatedChevronContainer left onClick={() => prevSlide()}>
        <BsChevronLeft className='absolute h-full left-0' />
      </AnimatedChevronContainer>
      <AnimatedChevronContainer right onClick={() => nextSlide()}>
        <BsChevronRight className='absolute h-full right-0' />
      </AnimatedChevronContainer>

      <div className='absolute bottom-0 w-full mb-1.5 flex justify-center'>
        {readDetails.map((_, i) => (
          (i === current)
          ? <AnimatedBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={true} />
          : <AnimatedBsCircleFill key={`BsCircleFill-${i}`} size={7} selected={false} onClick={() => setCurrent(i)} />
        ))}
      </div>

    </div>
  )
}

export default DetailsView;