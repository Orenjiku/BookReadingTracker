import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircle, BsCircleFill } from 'react-icons/bs';

interface DetailsSliderPropsITF {
  readDetails: {
    key:string;
    value:number;
  }[];
}

const DetailsSlider = ({ readDetails }: DetailsSliderPropsITF) => {
  const [current, setCurrent] = useState<number>(0);

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative flex row-start-4 row-end-10 col-start-2 col-end-3 align-middle text-sm font-SortsMillGoudy-400 cursor-pointer'>

      <div className='relative flex h-full w-full justify-center items-center bg-blueGray-300'>
        <div className='absolute text-7.5xl z-0 text-coolGray-50'>{readDetails[current].value}</div>
        <div className='absolute font-AdventPro-400 text-2xl text-trueGray-900'>{readDetails[current].key}</div>
      </div>

      <div className='absolute h-full left-0 w-6/12 z-50' onClick={prevSlide}>
        <BsChevronLeft className='absolute h-full left-0' />
      </div>

      <div className='absolute h-full right-0 w-6/12 z-50' onClick={nextSlide}>
        <BsChevronRight className='absolute h-full right-0' />
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