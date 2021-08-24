import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircle, BsCircleFill } from 'react-icons/bs';
import tw, { styled } from 'twin.macro';

interface DetailsSliderPropsITF {
  isUpdating: boolean;
  readDetails: {
    key:string;
    value:number;
  }[];
}

interface ChevronPropsITF {
  left?: boolean;
  right?: boolean;
}

const ChevronContainer = styled.div<ChevronPropsITF>`
  ${tw`absolute`};
  ${tw`h-full`};
  ${tw`w-1/2`};
  ${tw`z-50`};
  left: ${({ left }) => left && 0};
  right: ${({ right }) => right && 0};
`

const DetailsSlider = ({ readDetails, isUpdating }: DetailsSliderPropsITF) => {
  const [current, setCurrent] = useState<number>(0);

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 align-middle text-sm font-SortsMillGoudy-400 cursor-pointer'>
      {/* <div className='bg-sky-600 h-full w-full'></div> */}
      <div className='relative flex h-full w-full justify-center items-center bg-blueGray-300'>
        <div className='absolute text-7.5xl z-0 text-coolGray-50'>{readDetails[current].value}</div>
        <div className='absolute font-AdventPro-400 text-2xl text-trueGray-900'>{readDetails[current].key}</div>
        <ChevronContainer left onClick={prevSlide}>
          <BsChevronLeft className='absolute h-full left-0' />
        </ChevronContainer>
        <ChevronContainer right onClick={nextSlide}>
          <BsChevronRight className='absolute h-full right-0' />
        </ChevronContainer>
      </div>

      <div className='absolute flex bottom-0 w-full justify-center mb-1.5'>
        {readDetails.map((_, i) => {
          return (i === current) ? <BsCircleFill key={`BsCircleFill-${i}`} size={7} className='mx-0.5 fill-current text-coolGray-50' /> : <BsCircle key={`BsCircle-${i}`} size={7} className='mx-0.5' />
        })}
      </div>

    </div>
  )
}

export default DetailsSlider;