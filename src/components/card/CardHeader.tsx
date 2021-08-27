import React from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
  isShowingDetails: boolean;
  handleShowDetails: Function;
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

const CardHeader = ({title, author, isShowingDetails, handleShowDetails}: CardHeaderPropsITF) => {
  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 pl-6 pr-1 rounded-t-2xl'>

      <div className='flex items-center'>
        <CSSTransition in={isShowingDetails} timeout={800} classNames='arrowRotate'>
          <AnimatedLeftArrow onClick={() => handleShowDetails()} />
        </CSSTransition>
        <div className='ml-2 font-AdventPro-200 text-2xl text-trueGray-900 truncate'>{title}</div>
      </div>

      <div className='absolute top-8 left-0 w-10 h-0.5 bg-sky-900'></div>
      <div className='flex w-full justify-end font-Charm-400 text-trueGray-900 pr-2 truncate'>{author.join(', ')}</div>

    </div>
    )
}

export default CardHeader;