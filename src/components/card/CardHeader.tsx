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

interface TitleITF {
  isTitleOverflow: boolean;
  titleOffsetRight: number;
  isTitleTranslatingLeft: boolean;
  isTitleEllipsis: boolean;
}

const Title = styled.p<TitleITF>`
  ${tw`max-w-min font-AllertaStencil-400 whitespace-nowrap text-blueGray-200 opacity-50`};
  ${({ isTitleEllipsis }) => isTitleEllipsis && css`${tw`truncate`}`};
  font-size: 1.625rem;
  letter-spacing: -1.5px;
  text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  --distance: ${({titleOffsetRight}) => titleOffsetRight};
  --rate: 30;
  --time: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  transition: transform var(--time) linear;
  &:hover {
    ${tw`text-trueGray-50 opacity-60`};
  }
  ${({ isTitleOverflow }) => isTitleOverflow && css`${tw`cursor-pointer`}`};
  ${({isTitleOverflow, isTitleTranslatingLeft}) => isTitleOverflow && isTitleTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--time) * 1s) linear;
  `};
`

interface AuthorITF {
  isAuthorOverflow: boolean;
  authorOffsetRight: number;
  isAuthorTranslatingLeft: boolean;
  isAuthorEllipsis: boolean;
}

const Author = styled.p<AuthorITF>`
  ${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`};
  ${({ isAuthorEllipsis }) => isAuthorEllipsis && css`${tw`truncate`}`};
  --distance: ${({authorOffsetRight}) => authorOffsetRight};
  --rate: 30;
  --time: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  transition: transform var(--time) linear;
  ${({ isAuthorOverflow }) => isAuthorOverflow && css`${tw`cursor-pointer`}`};
  ${({isAuthorOverflow, isAuthorTranslatingLeft}) => isAuthorOverflow && isAuthorTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--time) * 1s) linear;
  `};
`

const StyledEdit = styled(Edit)<{isEditing?: boolean}>`
  ${tw`absolute right-1 top-2 min-w-min fill-current text-blueGray-200 text-opacity-90 cursor-pointer`};
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
                    drop-shadow(0 0 42px #0fa)
                    drop-shadow(0 0 82px #0fa)
                    drop-shadow(0 0 92px #0fa)
                    drop-shadow(0 0 102px #0fa)
                    drop-shadow(0 0 151px #0fa);
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

const CardHeader = ({title, author, isShowingSlide, isEditing, handleShowSlide, handleEdit}: CardHeaderPropsITF) => {

  const authors = author.join(', ');
  const cardHeaderRef = useRef(null);
  const bookTitleRef = useRef<HTMLParagraphElement>(null);
  const bookAuthorRef = useRef<HTMLParagraphElement>(null);

  const { isRefXOverflowing: isTitleOverflow, refOffsetRight: titleOffsetRight } = useXOverflow(bookTitleRef);
  const { isRefXOverflowing: isAuthorOverflow, refOffsetRight: authorOffsetRight } = useXOverflow(bookAuthorRef);

  const { leftPosition: titleLeftPosition } = useLeftPosition(bookTitleRef);
  const [ isTitleEllipsis, setIsTitleEllipsis ] = useState(true);
  const [ isTitleTranslatingLeft, setIsTitleTranslatingLeft] = useState(false);

  const { leftPosition: authorLeftPosition } = useLeftPosition(bookAuthorRef);
  const [ isAuthorEllipsis, setIsAuthorEllipsis ] = useState(true);
  const [ isAuthorTranslatingLeft, setIsAuthorTranslatingLeft] = useState(false);

  const handleEllipsis = (input: 'title' | 'author') => {
    if (!bookTitleRef.current || !bookAuthorRef.current) return;
    if (input === 'title') {
      if (bookTitleRef.current.getBoundingClientRect().left === titleLeftPosition) setIsTitleEllipsis(true);
    } else if (input === 'author') {
      if (bookAuthorRef.current.getBoundingClientRect().left === authorLeftPosition) setIsAuthorEllipsis(true);
    }
  }

  const handleClick = (input: 'title' | 'author') => {
    if (input === 'title') {
      setIsTitleTranslatingLeft((isTitleTranslatingLeft) => !isTitleTranslatingLeft);
      setIsTitleEllipsis(false);
    } else if (input === 'author') {
      setIsAuthorTranslatingLeft((isAuthorTranslatingLeft) => !isAuthorTranslatingLeft);
      setIsAuthorEllipsis(false);
    }
  }

  return (
    <div className='relative col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl overflow-hidden'>
        <StyledEdit size={22} isEditing={isEditing} onClick={() => handleEdit()} />

      <div className='flex items-center justify-start pl-2 -mb-1.5'>
        <CSSTransition in={isShowingSlide} timeout={800} classNames='arrowRotate' nodeRef={cardHeaderRef}>
          <StyledLeftArrow size={24} ref={cardHeaderRef} onClick={() => {!isEditing && handleShowSlide()}} />
        </CSSTransition>
        <div className='ml-2 mr-5 overflow-hidden'>
          <Title ref={bookTitleRef} isTitleOverflow={isTitleOverflow} titleOffsetRight={titleOffsetRight} onClick={() => handleClick('title')} isTitleTranslatingLeft={isTitleTranslatingLeft} onTransitionEnd={() => handleEllipsis('title')} isTitleEllipsis={isTitleEllipsis} {...(isTitleOverflow && {title: title})}>{title}</Title>
        </div>
      </div>

      <div className='relative ml-2 mr-5 flex justify-end'>
        <div className='ml-16 overflow-hidden'>
          <Author ref={bookAuthorRef} isAuthorOverflow={isAuthorOverflow} authorOffsetRight={authorOffsetRight} onClick={() => handleClick('author')} isAuthorTranslatingLeft={isAuthorTranslatingLeft} onTransitionEnd={() => handleEllipsis('author')} isAuthorEllipsis={isAuthorEllipsis} {...(isAuthorOverflow && {title: authors})}>{authors}</Author>
        </div>
      </div>

    </div>
  )
}

export default CardHeader;