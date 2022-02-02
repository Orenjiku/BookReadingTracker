import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { BsChevronExpand } from 'react-icons/bs';


const StyledChevronExpand = styled(BsChevronExpand)<{ $isLit: boolean }>`
  ${tw`absolute right-0 stroke-current`};
  ${({ $isLit }) => $isLit && css`
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

  const [ isLit, setIsLit ] = useState(false);

  let delayLight: ReturnType<typeof setTimeout>;
  useEffect(() => {
    delayLight = setTimeout(() => {
      isExpanded ? setIsLit(true) : setIsLit(false);
    }, expandTimer);

    return () => clearTimeout(delayLight);
  }, [isExpanded]);

  return (
    <StyledChevronExpand size={15} $isLit={isLit} />
  )
};

export default ExpandChevron;