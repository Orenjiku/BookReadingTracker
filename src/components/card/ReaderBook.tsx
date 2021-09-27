import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { ReaderBookITF } from '../../interfaces/interface';
import ReadInstance from './ReadInstance';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const ReaderBookContainer = styled.div<{$isExpand: boolean}>`
  ${tw`row-start-10 row-end-20 col-start-2 col-end-3 flex flex-col flex-grow font-SortsMillGoudy-400 overflow-hidden`};
  ${({ $isExpand }) => $isExpand && css`${tw`row-start-4`}`}
`

const ReaderBook = ({ readerBook, isEdit, handleIsReading, handleIsReaderBookExpanded, isReaderBookExpanded }: { readerBook: ReaderBookITF; isEdit: boolean; handleIsReading: Function; handleIsReaderBookExpanded: Function; isReaderBookExpanded: boolean }) => {
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
    <ReaderBookContainer $isExpand={isReaderBookExpanded}>

      {readInstanceLength > 1 &&
        <div className='relative bg-trueGray-50 bg-opacity-10 border-t border-b border-trueGray-50 flex justify-center items-center'>

          <p>{readInstanceLength - readInstanceIdx}</p>

          {!isIdxStart &&
            <div className='absolute left-0 w-1/4 h-full flex items-center cursor-pointer' onClick={() => prevSlide()} >
              <BsChevronLeft className='absolute left-1 stroke-current stroke-1 text-coolGray-50' />
            </div>
          }

          {!isIdxEnd &&
            <div className='absolute right-0 w-1/4 h-full flex items-center cursor-pointer' onClick={() => nextSlide()}>
              <BsChevronRight className='absolute right-1 stroke-current stroke-1 text-coolGray-50' />
            </div>
          }

        </div>
      }

      <ReadInstance key={readerBook.read_instance[readInstanceIdx].ri_id} readInstance={readerBook.read_instance[readInstanceIdx]} handleIsReaderBookExpanded={handleIsReaderBookExpanded} isEdit={isEdit} />

    </ReaderBookContainer>
  )
}

export default ReaderBook;