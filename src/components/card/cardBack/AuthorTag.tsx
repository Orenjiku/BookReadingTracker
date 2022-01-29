import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { RiDeleteBack2Line } from 'react-icons/ri';


interface AuthorTagPropsITF {
  author: string;
  fromList: 'author' | 'newAuthor'
  handleDeleteAuthor: Function;
  handleResetFormLabel: Function;
}

const AuthorTagContainer = styled.div<{ $isMouseDown: boolean; $hoverTimer: number; $holdTimer: number }>`
  ${tw`relative flex items-center font-Charm-400 text-sm border border-trueGray-50 rounded px-1 py-0.5 mr-1 my-0.5 cursor-pointer select-none overflow-hidden`};
  --hoverDuration: ${({ $hoverTimer }) => `${$hoverTimer}ms`};
  --holdDuration: ${({ $holdTimer }) => `${$holdTimer}ms`};
  transition: border var(--hoverDuration) linear;
  &:hover {
    ${tw`border-red-500 border-opacity-60`};
  }
  &::after {
    content: '';
    ${tw`absolute h-full left-0 w-0 bg-red-400 bg-opacity-40`};
    z-index: -1;
    transition: all 150ms linear;
    ${({ $isMouseDown }) => $isMouseDown && css`
      ${tw`h-full w-full`};
      transition: all var(--holdDuration) linear;
    `}
  }
`;

const StyledRiDeleteBack2Line = styled(RiDeleteBack2Line)<{ $hoverTimer: number }>`
  transform: rotateY(180deg);
  transition: all ${({ $hoverTimer }) => $hoverTimer}ms linear;
  ${AuthorTagContainer}:hover & {
    ${tw`stroke-current text-red-500 opacity-60`}
  }
`;

const AuthorTag = ({ author, fromList, handleDeleteAuthor, handleResetFormLabel }: AuthorTagPropsITF) => {
  const [ isMouseDown, setIsMouseDown ] = useState(false);
  const hoverTimer = 300;
  const holdTimer = 600;

  let deleteTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (isMouseDown) {
      deleteTimeout = setTimeout(() => {
        handleDeleteAuthor(author, fromList);
      }, holdTimer);
    }
    return () => clearTimeout(deleteTimeout);
  }, [isMouseDown]);

  const handleStartDelete = () => setIsMouseDown(true);

  const handleStopDelete = () => {
    setIsMouseDown(false);
    clearTimeout(deleteTimeout);
  };

  return (
    <AuthorTagContainer $isMouseDown={isMouseDown} $hoverTimer={hoverTimer} $holdTimer={holdTimer} onMouseDown={() => { handleStartDelete(); handleResetFormLabel('author'); }} onMouseUp={handleStopDelete} onMouseLeave={handleStopDelete}>
      <p className='pr-1'>{author}</p>
      <StyledRiDeleteBack2Line $hoverTimer={hoverTimer} />
    </AuthorTagContainer>
  )
}

export default AuthorTag;