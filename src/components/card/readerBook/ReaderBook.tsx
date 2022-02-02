import React, { cloneElement, memo } from 'react';
import { styled } from 'twin.macro';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadInstanceITF } from '../../../interfaces/interface';
import usePrevious from '../../../hooks/usePrevious';
import ReadInstance from '../readInstance/ReadInstance';
import ReaderBookHeader from './ReaderBookHeader';


interface ReaderBookPropsITF {
  readInstanceList: ReadInstanceITF[];
  readInstanceIdx: number;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  slideTimer: number;
  handleChangeReadInstanceIdx: Function;
  handleIsExpanded: Function;
  handleUpdateReaderBook: Function;
};

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

const ReaderBook = ({ readInstanceList, readInstanceIdx, isEdit, editTimer, isExpanded, expandTimer, slideTimer, handleIsExpanded, handleChangeReadInstanceIdx, handleUpdateReaderBook }: ReaderBookPropsITF) => {
  const prevIdx = usePrevious(readInstanceIdx);
  const prevLen = usePrevious(readInstanceList.length);

  //updating classNames inside useEffect doesn't seem to update before transition. Outside useEffect, classNames generates correct transition.
  const classNames = readInstanceList.length < prevLen || readInstanceIdx < prevIdx || (readInstanceIdx === 0 && readInstanceList.length > prevLen) ? 'backward' : 'forward';

  return (
    <div className='h-full overflow-hidden'>

      <ReaderBookHeader readInstanceIdx={readInstanceIdx} readInstanceListLen={readInstanceList.length} handleChangeReadInstanceIdx={handleChangeReadInstanceIdx} />

      <TransitionGroup component={null} childFactory={child => cloneElement(child, {classNames})}>
        <CSSTransition key={`readInstance-${readInstanceIdx}`} timeout={slideTimer} unmountOnExit /* nodeRef={readerBookRef} */>
          <ReadInstanceContainer /* ref={readerBookRef} */>
            <ReadInstance key={readInstanceList[readInstanceIdx].ri_id} readInstance={readInstanceList[readInstanceIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleUpdateReaderBook={handleUpdateReaderBook}/>
          </ReadInstanceContainer>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
};

export default memo(ReaderBook);