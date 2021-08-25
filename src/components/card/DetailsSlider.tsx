import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircle, BsCircleFill } from 'react-icons/bs';
import tw, { styled, css} from 'twin.macro';

interface DetailsSliderPropsITF {
  isUpdating: boolean;
  readDetails: {
    key:string;
    value:number;
  }[];
}

const ChevronContainer = styled.div<{left?: boolean; right?: boolean;}>`
  ${tw`absolute h-full w-1/6 cursor-pointer z-50`};
  &:hover {
    ${tw`bg-trueGray-50 opacity-40`};
    transition: background-color 300ms ease-in-out, opacity 300ms ease-in-out;
  };
  ${({ left }) => left && css`left: 0;`};
  ${({ right }) => right && css`right: 0;`};
`

const DetailsSlider = ({ readDetails }: DetailsSliderPropsITF) => {
  const [current, setCurrent] = useState<number>(0);

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative flex row-start-4 row-end-10 col-start-2 col-end-3 align-middle text-sm font-SortsMillGoudy-400 cursor-default'>
      <div className='relative flex h-full w-full justify-center items-center bg-blueGray-300'>
        <div className='absolute text-7.5xl z-0 text-coolGray-50'>{readDetails[current].value}</div>
        <div className='absolute font-AdventPro-400 text-2xl text-trueGray-900'>{readDetails[current].key}</div>
      </div>
      <ChevronContainer left onClick={prevSlide}>
        <BsChevronLeft className='absolute h-full left-0' />
      </ChevronContainer>
      <ChevronContainer right onClick={nextSlide}>
        <BsChevronRight className='absolute h-full right-0' />
      </ChevronContainer>

      <div className='absolute flex bottom-0 w-full justify-center mb-1.5'>
        {readDetails.map((_, i) => {
          return (i === current) ? <BsCircleFill key={`BsCircleFill-${i}`} size={7} className='mx-0.5 fill-current text-coolGray-50' /> :
          <BsCircle key={`BsCircle-${i}`} size={7} className='mx-0.5 cursor-pointer' onClick={() => setCurrent(i)} />
        })}
      </div>

    </div>
  )
}

export default DetailsSlider;