import React, { useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';
import { Edit } from '@styled-icons/boxicons-regular/Edit';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
  isShowingDetails: boolean;
  isUpdating: boolean;
  handleShowDetails: Function;
  handleUpdateProgress: Function;
}

const AnimatedLeftArrow = styled(LeftArrow)`
  ${tw`min-w-min cursor-pointer`}
  ${tw`fill-current text-sky-900`};
  &.arrowRotate-enter-active {
    ${tw`text-red-500`}
    transform: rotate(-180deg);
    transition: all 800ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.arrowRotate-enter-done {
    ${tw`text-red-500`}
    transform: rotate(180deg);
  };
  &.arrowRotate-exit {
    ${tw`text-red-500`}
    transform: rotate(-180deg);
  }
  &.arrowRotate-exit-active {
    ${tw`text-sky-900`}
    transform: rotate(0deg);
    transition: all 800ms cubic-bezier(0.5, 0, 0.75, 0);
  };
`

const StyledEdit = styled(Edit)<{ isUpdating?: boolean}>`
  ${tw`fill-current text-sky-900 cursor-pointer`}
  ${({ isUpdating }) => isUpdating && css`
    ${tw`fill-current text-red-500`}

    animation: bounce 1s infinite;
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-10%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `}
`

const CardHeader = ({title, author, isShowingDetails, isUpdating, handleShowDetails, handleUpdateProgress}: CardHeaderPropsITF) => {
  const cardHeaderRef = useRef(null);
  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 pl-6 pr-1'>

      <div className='flex items-center'>
        <CSSTransition in={isShowingDetails} timeout={800} classNames='arrowRotate' nodeRef={cardHeaderRef}>
          <AnimatedLeftArrow size={20} ref={cardHeaderRef} onClick={() => {!isUpdating && handleShowDetails()}} />
        </CSSTransition>
        <div className='ml-2 text-trueGray-900 font-AdventPro-200 text-2xl truncate'>{title}</div>
        <StyledEdit size={20} isUpdating={isUpdating} onClick={() => handleUpdateProgress()} />
      </div>

      <div className='absolute top-8 left-0 w-10 h-0.5 bg-sky-900'></div>
      <div className='w-full flex justify-end pr-2 text-trueGray-900 font-Charm-400 truncate'>{author.join(', ')}</div>

    </div>
    )
}

export default CardHeader;