import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { BsChevronExpand } from 'react-icons/bs';

const StyledChevronExpand = styled(BsChevronExpand)<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`absolute right-0 stroke-current`};
  --duration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--duration) linear;
  ${({ $isExpanded }) => $isExpanded && css`
      --neon-light-center: #f9fafb;
      --neon-light-color: #0d9488;
      --light-effect: drop-shadow(0 0 1px var(--neon-light-center))
                      drop-shadow(0 0 3px var(--neon-light-center))
                      drop-shadow(0 0 5px var(--neon-light-color));
      opacity: 1;
      color: var(--neon-light-center);
      filter: var(--light-effect);
  `}
`;

const ExpandChevron = ({ isExpanded, expandTimer }: { isExpanded: boolean; expandTimer: number }) => {
  return (
    <StyledChevronExpand size={15} $isExpanded={isExpanded} $expandTimer={expandTimer} />
  )
};

export default ExpandChevron;