import React, { useState, useEffect } from 'react';
import { RiDeleteBack2Line } from 'react-icons/ri';
import tw, { styled, css } from 'twin.macro';


interface AuthorTagPropsITF {
  author: {
    ba_id: number,
    full_name: string
  };
  handleDeleteAuthor: Function;
}

const StyledRiDeleteBack2Line = styled(RiDeleteBack2Line)<{ $hoverTimer: number }>`
  transition: all ${({ $hoverTimer }) => $hoverTimer}ms linear;
`;

const AuthorTagContainer = styled.div<{ $isMouseDown: boolean; $hoverTimer: number; $holdTimer: number }>`
  ${tw`relative flex items-center font-Charm-400 text-sm border border-trueGray-50 rounded px-1 mr-1 mb-1.5 cursor-pointer select-none overflow-hidden`};
  transition: border ${({ $hoverTimer }) => $hoverTimer}ms linear;
  &:hover {
    ${tw`border-red-500 border-opacity-60`};
  }
  &:hover > ${StyledRiDeleteBack2Line} {
    ${tw`stroke-current text-red-500 opacity-60`}
  }
  &::after {
    content: '';
    ${tw`absolute h-full left-0 w-0 bg-red-400 bg-opacity-40`};
    transition: all 200ms linear;
    ${({ $isMouseDown, $holdTimer }) => $isMouseDown && css`
      ${tw`h-full w-full`};
      transition: all ${$holdTimer}ms linear;
    `}
  }
`;
const AuthorTag = ({ author, handleDeleteAuthor }: AuthorTagPropsITF) => {
  const [ isMouseDown, setIsMouseDown ] = useState(false);
  const hoverTimer = 300;
  const holdTimer = 800;

  let deleteTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (isMouseDown) {
      deleteTimeout = setTimeout(() => {
        handleDeleteAuthor(author.ba_id);
        setIsMouseDown(false);
        clearTimeout(deleteTimeout);
      }, holdTimer);
    }
    return () => clearTimeout(deleteTimeout);
  }, [isMouseDown]);

  const handleMouseDown = () => setIsMouseDown(true);
  const handleStopTimeout = () => {
    setIsMouseDown(false);
    clearTimeout(deleteTimeout);
  };

  return (
    <AuthorTagContainer $isMouseDown={isMouseDown} $hoverTimer={hoverTimer} $holdTimer={holdTimer} onMouseDown={handleMouseDown} onMouseUp={handleStopTimeout} onMouseLeave={handleStopTimeout}>
      <p className='pr-1'>{author.full_name}</p>
      <StyledRiDeleteBack2Line $hoverTimer={hoverTimer} />
    </AuthorTagContainer>
  )
}

export default AuthorTag;