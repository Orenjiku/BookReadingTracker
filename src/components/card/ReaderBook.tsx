import React, { useState, useEffect, cloneElement } from 'react';
import tw, { styled } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadInstanceITF } from '../../interfaces/interface';
import ReadInstance from './ReadInstance';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';


interface ReaderBookPropsITF {
  readInstanceList: ReadInstanceITF[];
  readInstanceIdx: number;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  handleChangeReadInstanceIdx: Function;
  handleIsExpanded: Function;
  handleUpdateReaderBook: Function;
}

const ReaderBookHeader = styled.div`
  ${tw`relative border-b border-trueGray-50 flex justify-center items-center`};
  height: 1.75rem;
`;

const ReadInstanceContainer = styled.div`
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

const ReaderBook = ({ readInstanceList, readInstanceIdx, isEdit, editTimer, isExpanded, expandTimer, handleIsExpanded, handleChangeReadInstanceIdx, handleUpdateReaderBook }: ReaderBookPropsITF) => {
  const readInstanceListLength = readInstanceList.length;

  const [ isIdxStart, setIsIdxStart ] = useState(true);
  const [ isIdxEnd, setIsIdxEnd ] = useState(false);

  const [ transitionClassNames, setTransitionClassNames ] = useState('');
  // const readerBookRef = useRef(null);

  useEffect(() => {
    readInstanceIdx === 0 ? setIsIdxStart(true) : setIsIdxStart(false);
    readInstanceIdx === readInstanceListLength - 1 ? setIsIdxEnd(true) : setIsIdxEnd(false);
  }, [readInstanceIdx]);

  const prevSlide = () => {
    handleChangeReadInstanceIdx(readInstanceIdx - 1);
    setTransitionClassNames('backward');
  };

  const nextSlide = () => {
    handleChangeReadInstanceIdx(readInstanceIdx + 1);
    setTransitionClassNames('forward');
  };


  const convertToRoman = (num: number): string | number => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    return num <= 11 ? roman[num - 1] : num;
  };

  return (
    <div className='h-full overflow-hidden'>

      <ReaderBookHeader>

        <p className='font-Alegreya-500 text-center text-xl'>{convertToRoman(readInstanceListLength - readInstanceIdx)}</p>

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
        <CSSTransition key={`ReadInstance-${readInstanceIdx}`} timeout={300} unmountOnExit /* nodeRef={readerBookRef} */>
          <ReadInstanceContainer /* ref={readerBookRef} */>
            <ReadInstance key={readInstanceList[readInstanceIdx].ri_id} readInstance={readInstanceList[readInstanceIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleUpdateReaderBook={handleUpdateReaderBook}/>
          </ReadInstanceContainer>
        </CSSTransition>
      </TransitionGroup>

    </div>
  )
}

export default ReaderBook;