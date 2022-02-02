import React, { useState, useEffect, memo } from 'react';
import tw, { styled } from 'twin.macro';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';


interface ReaderBookHeaderPropsITF {
  readInstanceIdx: number;
  readInstanceListLen: number;
  handleChangeReadInstanceIdx: Function;
};

const ReaderBookHeaderContainer = styled.div`
  ${tw`relative border-b border-trueGray-50 flex justify-center items-center`};
  height: 1.75rem;
`;

const ReaderBookHeader = ({ readInstanceIdx, readInstanceListLen, handleChangeReadInstanceIdx }: ReaderBookHeaderPropsITF) => {

  const [ isIdxStart, setIsIdxStart ] = useState(true);
  const [ isIdxEnd, setIsIdxEnd ] = useState(false);

  useEffect(() => {
    readInstanceIdx === 0 ? setIsIdxStart(true) : setIsIdxStart(false); //if idx at 0, remove left arrow
    readInstanceIdx === readInstanceListLen - 1 ? setIsIdxEnd(true) : setIsIdxEnd(false); //if idx at last, remove right arrow.
  }, [readInstanceIdx]);

  const prevSlide = () => handleChangeReadInstanceIdx(readInstanceIdx - 1);
  const nextSlide = () => handleChangeReadInstanceIdx(readInstanceIdx + 1);

  const convertToRoman = (num: number): string => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    return num <= 11 ? roman[num - 1] : num.toString();
  };

  return (
    <ReaderBookHeaderContainer>
      <p className='font-Alegreya-500 text-center text-xl'>{convertToRoman(readInstanceListLen - readInstanceIdx)}</p>

      {!isIdxStart &&
        <div className='absolute left-0 w-1/3 h-full flex items-center cursor-pointer' onClick={prevSlide} >
          <BsChevronLeft className='absolute left-1' />
        </div>
      }

      {!isIdxEnd &&
        <div className='absolute right-0 w-1/3 h-full flex items-center cursor-pointer' onClick={nextSlide}>
          <BsChevronRight className='absolute right-1' />
        </div>
      }
    </ReaderBookHeaderContainer>
  )
};

export default memo(ReaderBookHeader);