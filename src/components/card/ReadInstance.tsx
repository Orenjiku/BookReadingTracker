import React, { useState, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import { ReadInstanceITF } from '../../interfaces/interface';
import ReadEntry from './ReadEntry';
import useYOverflow from '../../hooks/useYOverflow';
import { BsChevronDown, BsChevronUp, BsChevronExpand } from 'react-icons/bs';
import { CgCalendarToday } from 'react-icons/cg';


interface ReadInstancePropsITF {
  readInstance: ReadInstanceITF;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  handleIsExpanded: Function;
  handleDeleteReadEntry: Function;
}

const ReadInstanceHeaderContainer = styled.div`
  ${tw`relative h-6 pt-1 pb-1 flex justify-evenly items-center font-Charm-400 text-sm cursor-pointer`}
`;

const StyledChevronExpand = styled(BsChevronExpand)<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`absolute right-0 stroke-current`};
  --duration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--duration) linear;
  ${ReadInstanceHeaderContainer}:hover & {
    animation: shake 500ms linear infinite;
    @keyframes shake {
      0%, 50%, 100% {
        transform: translateY(0%);
      }
      25% {
        transform: translateY(-5%);
      }
      75% {
        transform: translateY(5%);
      }
    }
  }
  ${({ $isExpanded }) => $isExpanded && css`
      --neon-light-center: #f9fafb;
      --neon-light-color: #0d9488;
      --light-effect: drop-shadow(0 0 1px var(--neon-light-center))
                      drop-shadow(0 0 3px var(--neon-light-center))
                      drop-shadow(0 0 5px var(--neon-light-color));
      opacity: 1;
      color: var(--neon-light-center);
      filter: var(--light-effect);
      transition: all var(--duration) linear;
  `}
`;

const AnimatedLine = styled.div<{ $isExpanded: boolean }>`
  ${tw`absolute bottom-0 w-0 bg-trueGray-400`};
  height: 0.5px;
  transition: all 250ms ease-out;
  ${ReadInstanceHeaderContainer}:hover & {
    ${tw`absolute bottom-0 w-full bg-trueGray-400`};
    height: 0.5px;
    transition: all 250ms ease-in;
  }
  ${({ $isExpanded }) => $isExpanded && css`
    ${tw`absolute bottom-0 w-full bg-trueGray-400`};
    height: 0.5px;
    transition: all 250ms ease-in;
  `}
`;

const ReadEntryContainer = styled.div<{ $readEntryListAppendTimer: number }>`
  &:nth-child(2) {
    ${tw`mt-1`};
  }
  &:last-child {
    ${tw`mb-2`};
  }
  --duration: ${({ $readEntryListAppendTimer }) => `${$readEntryListAppendTimer}ms`};
  &.slideFade-enter {
    opacity: 0;
    max-height: 0;
  }
  &.slideFade-enter-active {
    opacity: 1;
    max-height: 52px;
    transition: opacity calc(var(--duration) * 0.4) ease-out, max-height var(--duration) ease-out;
  }
  &.slideFade-exit {
    opacity: 1;
    max-height: 52px;
  }
  &.slideFade-exit-active {
    opacity: 0;
    max-height: 0;
    transition: opacity calc(var(--duration) * 0.4) ease-out, max-height var(--duration) ease-out;
  }
`;

const ReadInstance = ({ readInstance, isEdit, editTimer, isExpanded, expandTimer, handleIsExpanded, handleDeleteReadEntry } : ReadInstancePropsITF) => {
  const readEntryList = readInstance.read_entry || [];
  const [ readEntrySelectToggle, setReadEntrySelectToggle ] = useState(false);
  const readEntryListAppendTimer = 500;
  const readEntrySelectTimer = 300;

  // const bookReadRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overflowTriggers = {
    isExpanded,
    expandTimer,
    readEntryListLength: readEntryList.length,
    readEntryListAppendTimer,
    readEntrySelectToggle,
    readEntrySelectTimer,
    isEdit
  };
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow({scrollContainerRef, overflowTriggers});

  const handleToggle = () => setReadEntrySelectToggle(readEntrySelectToggle => !readEntrySelectToggle);

  return (
    <div className='relative h-full w-full overflow-hidden'>

      <div ref={scrollContainerRef} className='h-full overflow-y-scroll scrollbar-hide'>

        <ReadInstanceHeaderContainer onClick={() => handleIsExpanded()}>
          <div className='flex items-center'>
            <p className='mr-0.5'>Read: {readInstance.days_read}</p>
            <CgCalendarToday />
          </div>
          <div className='flex items-center'>
            <p className='mr-0.5'>Total: {readInstance.days_total}</p>
            <CgCalendarToday />
          </div>

          <StyledChevronExpand size={15} $isExpanded={isExpanded} $expandTimer={expandTimer} />
          <AnimatedLine $isExpanded={isExpanded}/>
        </ReadInstanceHeaderContainer>

        <TransitionGroup component={null}>
          {readEntryList.map(readEntry => (
            <CSSTransition key={`cssT-${readEntry.re_id}`} timeout={readEntryListAppendTimer} classNames='slideFade' /* nodeRef={bookReadRef} */ >
              <ReadEntryContainer $readEntryListAppendTimer={readEntryListAppendTimer} /* ref={bookReadRef} */>
                <ReadEntry key={readEntry.re_id} readEntry={readEntry} isEdit={isEdit} editTimer={editTimer} readEntrySelectTimer={readEntrySelectTimer} handleToggle={handleToggle} handleDeleteReadEntry={handleDeleteReadEntry}/>
              </ReadEntryContainer>
            </CSSTransition>
          ))}
        </TransitionGroup>

      </div>

      {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0' />}
      {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0' />}

    </div>
  )
}

export default ReadInstance;