import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { BsCircleFill } from 'react-icons/bs';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

interface DetailsViewITF {
  isUpdating: boolean;
  readDetails: {
    key:string;
    value:number;
  }[];
}

const ChevronContainer = styled.div<{left?: boolean; right?: boolean;}>`
  ${tw`absolute h-full w-1/6 cursor-pointer transition duration-300 ease-in`};
  &:hover {
    ${tw`bg-trueGray-50 bg-opacity-40 transition duration-500 ease-in-out`};
  };
  ${({ left }) => left && css`left: 0;`};
  ${({ right }) => right && css`right: 0;`};
`

const StyledBsCircleFill = styled(BsCircleFill)<{selected?: boolean}>`
  ${tw`mx-0.5 fill-current text-coolGray-50 cursor-pointer`};
  ${({ selected }) => selected && css`${tw`fill-current text-teal-600`}`};
  ${({ selected }) => !selected && css`
    &:hover {
      ${tw`fill-current text-teal-600 animate-pulse`};
    }
  `}
  `

const FormContainer = styled.div`
  ${tw`h-full w-full bg-blue-300 z-10`}
  &.formSlide-enter {
    transform: translateY(105%);
  }
  &.formSlide-enter-active {
    transform: translateY(0%);
    transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  &.formSlide-exit-active {
    transform: translateY(105%);
    transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
  }
`

const DetailsView = ({ readDetails, isUpdating }: DetailsViewITF) => {
  const [current, setCurrent] = useState<number>(0);

  const length = readDetails.length
  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current + length - 1 ) % length);

  return (
    <div className='relative row-start-4 row-end-10 col-start-2 col-end-3 flex justify-center items-center text-sm font-SortsMillGoudy-400 bg-blueGray-300 overflow-hidden'>

      <div className='absolute text-7.5xl text-coolGray-50'>{readDetails[current].value}</div>
      <div className='absolute font-AdventPro-400 text-2xl text-trueGray-900'>{readDetails[current].key}</div>

      <ChevronContainer left onClick={prevSlide}>
        <BsChevronLeft className='absolute h-full left-0' />
      </ChevronContainer>
      <ChevronContainer right onClick={nextSlide}>
        <BsChevronRight className='absolute h-full right-0' />
      </ChevronContainer>

      <div className='absolute flex bottom-0 w-full justify-center mb-1.5'>
        {readDetails.map((_, i) => (
          (i === current)
          ? <StyledBsCircleFill selected key={`BsCircleFill-${i}`} size={7} />
          : <StyledBsCircleFill key={`BsCircleFill-${i}`} size={7} onClick={() => setCurrent(i)} />
        ))}
      </div>

      <CSSTransition in={isUpdating} timeout={800} classNames='formSlide' unmountOnExit>
        <FormContainer>
          <form>
            <input type='text' className='h-1/2'></input>
            <input type='submit' value='Submit' />
          </form>
        </FormContainer>
      </CSSTransition>

    </div>
  )
}

export default DetailsView;