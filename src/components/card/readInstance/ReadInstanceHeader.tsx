import React from 'react';
import tw, { styled, css } from 'twin.macro';
import ExpandChevron from './ExpandChevron';
import { CgCalendarToday } from 'react-icons/cg';


interface ReadInstanceHeaderPropITF {
  daysRead: number;
  daysTotal: number;
  isExpanded: boolean;
  expandTimer: number;
  handleIsExpanded: Function;
};

const ReadInstanceHeaderContainer = styled.div`
  ${tw`relative h-6 pt-1 pb-1 flex justify-evenly items-center font-Charm-400 text-sm cursor-pointer`}
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

const ReadInstanceHeader = ({ daysRead, daysTotal, isExpanded, expandTimer, handleIsExpanded }: ReadInstanceHeaderPropITF) => {
  return (
    <ReadInstanceHeaderContainer onClick={() => handleIsExpanded()}>
      <div className='flex items-center'>
        <p className='mr-0.5'>Read: {daysRead}</p>
        <CgCalendarToday />
      </div>
      <div className='flex items-center'>
        <p className='mr-0.5'>Total: {daysTotal}</p>
        <CgCalendarToday />
      </div>

      <ExpandChevron isExpanded={isExpanded} expandTimer={expandTimer} />
      <AnimatedLine $isExpanded={isExpanded} />
    </ReadInstanceHeaderContainer>
  )
};

export default ReadInstanceHeader;