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
  ${tw`fill-current text-sky-900 cursor-pointer`};
  min-width: 20px;
  min-height: 20px;
  width: 20px;
  height: 20px;
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
  ${tw`fill-current text-sky-900`}
  &:hover {
    ${tw`cursor-pointer`}
  }
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

// const Button = styled.button<{ isUpdating?: boolean }>`
//   ${tw`font-AdventPro-200 text-sm border rounded w-max h-6 px-1.5 mx-1 flex justify-center items-center`}
//   ${({ isUpdating }) => isUpdating && css`${tw`bg-red-200`}`}
// `

const CardHeader = ({title, author, isShowingDetails, isUpdating, handleShowDetails, handleUpdateProgress}: CardHeaderPropsITF) => {
  const cardHeaderRef = useRef(null);
  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 pl-6 pr-1 rounded-t-2xl'>

      <div className='flex items-center'>
        <CSSTransition in={isShowingDetails} timeout={800} classNames='arrowRotate' nodeRef={cardHeaderRef}>
          <AnimatedLeftArrow ref={cardHeaderRef} onClick={() => handleShowDetails()} />
        </CSSTransition>
        <div className='ml-2 font-AdventPro-200 text-2xl text-trueGray-900 truncate'>{title}</div>
        <StyledEdit isUpdating={isUpdating} size={20} onClick={() => handleUpdateProgress()} />
        {/* <Button isUpdating={isUpdating} className='bg-blueGray-300 text-trueGray-900' onClick={() => handleUpdateProgress()}>Update Progress</Button> */}
      </div>

      <div className='absolute top-8 left-0 w-10 h-0.5 bg-sky-900'></div>
      <div className='flex w-full justify-end font-Charm-400 text-trueGray-900 pr-2 truncate'>{author.join(', ')}</div>

    </div>
    )
}

export default CardHeader;