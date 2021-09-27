import React, { useState, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import { ReaderBookITF } from '../../interfaces/interface';
import ReadInstance from './ReadInstance';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';

const ReaderBookContainer = styled.div`
  ${tw`row-start-10 row-end-20 col-start-2 col-end-3 font-SortsMillGoudy-400 overflow-hidden`};
  display: grid;
  grid-template-rows: repeat(6, 1fr);
`

const ReaderBook = ({ readerBook, isEdit, handleIsReading }: { readerBook: ReaderBookITF; isEdit: boolean; handleIsReading: Function }) => {
  const readInstanceLength = readerBook.read_instance.length;
  // startIdx is either the index of a read_instance that is_reading, or the most recent read_instance, i.e. index = 0
  const startIdx = readerBook.is_any_reading ? readerBook.read_instance.findIndex(instance => instance.is_reading === true) : 0;
  const [ readInstanceIdx, setReadInstanceIdx ] = useState(startIdx);
  const [ isIdxStart, setIsIdxStart ] = useState(true);
  const [ isIdxEnd, setIsIdxEnd ] = useState(false);

  useEffect(() => {
    handleIsReading(readerBook.read_instance[readInstanceIdx].is_reading);
    readInstanceIdx === 0 ? setIsIdxStart(true) : setIsIdxStart(false);
    readInstanceIdx === readInstanceLength- 1 ? setIsIdxEnd(true) : setIsIdxEnd(false);
  }, [readInstanceIdx])

  // const classNames = ((readerBookIdx > prevIdx && readerBookIdx !== prevIdx + (length - 1)) || readerBookIdx === prevIdx - (length - 1)) ? 'forward' : 'backward';
  const prevSlide = () => setReadInstanceIdx(readInstanceIdx - 1);
  const nextSlide = () => setReadInstanceIdx(readInstanceIdx + 1);

  return (
    <ReaderBookContainer>
      {readInstanceLength > 1 &&
        <div className='relative row-start-1 row-end-2 bg-trueGray-50 bg-opacity-10 border-t border-b border-trueGray-50 flex justify-center items-center text-xl'>
          {readInstanceLength - readInstanceIdx}

          {!isIdxStart &&
            <div className='absolute left-0 h-full w-1/3 flex items-center overflow-hidden'>
              <BsChevronUp className='absolute left-0 stroke-current stroke-1 text-coolGray-50' onClick={() => prevSlide()} />
            </div>
          }

          {!isIdxEnd &&
            <div className='absolute right-0 h-full w-1/3 flex items-center overflow-hidden'>
              <BsChevronDown className='absolute right-0 stroke-current stroke-1 text-coolGray-50' onClick={() => nextSlide()} />
            </div>
          }
        </div>
      }

      <div className={`${readInstanceLength === 1 ? 'row-start-1 row-end-7' : 'row-start-2 row-end-7'} overflow-hidden`}>
        <ReadInstance key={readerBook.read_instance[readInstanceIdx].ri_id} readInstance={readerBook.read_instance[readInstanceIdx]} isEdit={isEdit} />
      </div>
    </ReaderBookContainer>
  )
}

export default ReaderBook;