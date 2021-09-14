import React, { useState, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import useXOverflow from '../../hooks/useXOverflow';
import useLeftPosition from '../../hooks/useLeftPosition';
import { CSSTransition } from 'react-transition-group';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';
import { Edit } from '@styled-icons/boxicons-regular/Edit';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
  isShowingSlide: boolean;
  isEditing: boolean;
  handleShowSlide: Function;
  handleEdit: Function;
}

const StyledLeftArrow = styled(LeftArrow)`
  ${tw`min-w-min cursor-pointer`};
  ${tw`fill-current text-sky-900`};
  &.arrowRotate-enter-active {
    ${tw`text-red-500`};
    transform: rotate(-180deg);
    transition: all 800ms cubic-bezier(0.22, 1, 0.36, 1);
  };
  &.arrowRotate-enter-done {
    ${tw`text-red-500`};
    transform: rotate(180deg);
  };
  &.arrowRotate-exit {
    ${tw`text-red-500`};
    transform: rotate(-180deg);
  }
  &.arrowRotate-exit-active {
    ${tw`text-sky-900`};
    transform: rotate(0deg);
    transition: all 800ms cubic-bezier(0.5, 0, 0.75, 0);
  };
`

const Title = styled.p<{isTitleOverflow: boolean; titleOffsetRight: number; showEllipsis: boolean}>`
  ${tw`max-w-min font-AllertaStencil-400 whitespace-nowrap text-blueGray-200 opacity-50`};
  ${({ showEllipsis }) => showEllipsis && css`${tw`truncate`}`};
  font-size: 1.625rem;
  letter-spacing: -1.5px;
  text-shadow: 0px -1px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  --distance: ${({titleOffsetRight}) => titleOffsetRight};
  --speed: 30;
  --time: calc(var(--distance) / var(--speed) * 1s);
  transform: translateX(0%);
  transition: transform var(--time) linear;
  &:hover {
    ${tw`text-trueGray-50 opacity-60`};
    ${({isTitleOverflow}) => isTitleOverflow && css`
      ${tw`overflow-visible`};
      transform: translateX(calc(var(--distance) * -1px));
      transition: transform var(--time) * 1s) linear;
    `}
  }
`

const StyledEdit = styled(Edit)<{isEditing?: boolean}>`
  ${tw`min-w-min fill-current text-blueGray-200 text-opacity-90 cursor-pointer`};
  --button-up: drop-shadow(0px 1px 0.5px gray);
  filter: var(--button-up);
  &:hover {
    ${tw`fill-current text-trueGray-50`};
    filter: var(--button-up)
            drop-shadow(0 0 7px #fff)
            drop-shadow(0 0 10px #fff)
            drop-shadow(0 0 21px #fff)
            drop-shadow(0 0 42px #0fa);
  }
  ${({ isEditing }) => isEditing && css`
    ${tw`fill-current text-trueGray-50`};
    --shadows-down: drop-shadow(0px -1px 0.5px gray);
    --light-effect: drop-shadow(0 0 7px #fff)
                    drop-shadow(0 0 10px #fff)
                    drop-shadow(0 0 21px #fff)
                    drop-shadow(0 0 28px red)
                    drop-shadow(0 0 42px red)
                    drop-shadow(0 0 50px #fff)
                    drop-shadow(0 0 64px red);
    animation: blink 1s ease-out forwards;
    @keyframes blink {
      0%, 20%, 40% {
        filter: var(--shadows-down);
      }
      10%, 30%, 100% {
        filter: var(--shadows-down)
                var(--light-effect);
      }
    }
  `}
`

const Author = styled.p<{isAuthorOverflow: boolean; authorOffsetRight: number}>`
  ${tw`absolute left-1/2 pr-2 flex justify-end text-trueGray-900 font-Charm-400 truncate`}
`

const CardHeader = ({title, author, isShowingSlide, isEditing, handleShowSlide, handleEdit}: CardHeaderPropsITF) => {

  const cardHeaderRef = useRef(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);

  const { isRefXOverflowing: isTitleOverflow, refOffsetRight: titleOffsetRight } = useXOverflow(titleRef);
  const { isRefXOverflowing: isAuthorOverflow, refOffsetRight: authorOffsetRight } = useXOverflow(authorRef);

  const { leftPosition } = useLeftPosition(titleRef);
  const [ showEllipsis, setShowEllipsis ] = useState<boolean>(false);

  const handleEllipsis = () => {
      if (!titleRef.current) return;
      if (titleRef.current.getBoundingClientRect().left === leftPosition) {
        setShowEllipsis(true);
      }
  }

  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4'>

      <div className='flex items-center justify-start pl-2 -mb-1.5'>
        <CSSTransition in={isShowingSlide} timeout={800} classNames='arrowRotate' nodeRef={cardHeaderRef}>
          <StyledLeftArrow size={24} ref={cardHeaderRef} onClick={() => {!isEditing && handleShowSlide()}} />
        </CSSTransition>
        <div className='ml-2 mr-5 w-full overflow-hidden'>
          <Title ref={titleRef} isTitleOverflow={isTitleOverflow} titleOffsetRight={titleOffsetRight} onMouseOver={() => setShowEllipsis(false)} onTransitionEnd={handleEllipsis} showEllipsis={showEllipsis}>{title}</Title>
        </div>
      </div>

      <div className='relative flex items-center overflow-hidden'>
        <StyledEdit size={22} isEditing={isEditing} onClick={() => handleEdit()} />
        <Author ref={authorRef} isAuthorOverflow={isAuthorOverflow} authorOffsetRight={authorOffsetRight}>{author.join(', ')}</Author>
      </div>

    </div>
  )
}

export default CardHeader;