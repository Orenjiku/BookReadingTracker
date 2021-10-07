import React, { useState, useEffect, cloneElement } from 'react';
import tw, { styled } from 'twin.macro';
import { ReaderBookITF } from '../../interfaces/interface';
import ReadInstance from './ReadInstance';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


interface ReaderBookPropsITF {
  readerBook: ReaderBookITF;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  handleIsReading: Function;
  handleIsExpanded: Function;
}

const ReaderBookHeader = styled.div`
  ${tw`relative border-b border-trueGray-50 flex justify-center items-center`};
  height: 1.75rem;
`;

const ReadInstanceTransitionContainer = styled.div`
  height: calc(100% - 1.75rem);
  --duration: 300ms;
  --timing-function: linear;
  --transition: all var(--duration) var(--timing-function);
  &.forward-enter {
    transform: translateX(100%);
  }
  &.forward-enter-active {
    transform: translateX(0%);
    transition: var(--transition);
  }
  &.forward-exit {
    transform: translateY(-100%);
  }
  &.forward-exit-active {
    transform: translateX(-100%) translateY(-100%);
    transition: var(--transition);
  }
  &.backward-enter {
    transform: translateX(-100%);
  }
  &.backward-enter-active {
    transform: translateX(0%);
    transition: var(--transition);
  }
  &.backward-exit {
    transform: translateY(-100%);
  }
  &.backward-exit-active {
    transform: translateX(100%) translateY(-100%);
    transition: var(--transition);
  }
`;

const ReaderBook = ({ readerBook, isEdit, editTimer, handleIsReading, isExpanded, expandTimer, handleIsExpanded }: ReaderBookPropsITF) => {
  const readInstanceLength = readerBook.read_instance.length;
  // startIdx is either the index of a read_instance that is_reading, or the most recent read_instance, i.e. index = 0
  const startIdx = readerBook.is_any_reading ? readerBook.read_instance.findIndex(instance => instance.is_reading === true) : 0;
  const [ isIdxStart, setIsIdxStart ] = useState(true);
  const [ isIdxEnd, setIsIdxEnd ] = useState(false);
  const [ currIdx, setCurrIdx ] = useState(startIdx);
  const [ transitionClassNames, setTransitionClassNames ] = useState('');
  // const readerBookRef = useRef(null);

  useEffect(() => {
    handleIsReading(readerBook.read_instance[currIdx].is_reading);
    currIdx === 0 ? setIsIdxStart(true) : setIsIdxStart(false);
    currIdx === readInstanceLength - 1 ? setIsIdxEnd(true) : setIsIdxEnd(false);
  }, [currIdx]);

  const prevSlide = () => {
    setCurrIdx(currIdx - 1);
    setTransitionClassNames('backward');
  };

  const nextSlide = () => {
    setCurrIdx(currIdx + 1);
    setTransitionClassNames('forward');
  };


  const convertToRoman = (num: number): string | number => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    return num <= 11 ? roman[num - 1] : num;
  };

  return (
    <div className='h-full overflow-hidden'>

      <ReaderBookHeader>

        <p className='font-Alegreya-500 text-center text-xl'>{convertToRoman(readInstanceLength - currIdx)}</p>

        {!isIdxStart &&
          <div className='absolute left-0 w-1/3 h-full flex items-center cursor-pointer' onClick={() => prevSlide()} >
            <BsChevronLeft className='absolute left-1' />
          </div>
        }

        {!isIdxEnd &&
          <div className='absolute right-0 w-1/3 h-full flex items-center cursor-pointer' onClick={() => nextSlide()}>
            <BsChevronRight className='absolute right-1' />
          </div>
        }

      </ReaderBookHeader>

      <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames: transitionClassNames})}>
        <CSSTransition key={`ReadInstance-${currIdx}`} timeout={300} unmountOnExit /* nodeRef={readerBookRef} */>
          <ReadInstanceTransitionContainer /* ref={readerBookRef} */>
            <ReadInstance key={readerBook.read_instance[currIdx].ri_id} readInstance={readerBook.read_instance[currIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} />
          </ReadInstanceTransitionContainer>
        </CSSTransition>
      </TransitionGroup>

    </div>
  )
}

export default ReaderBook;