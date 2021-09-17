import React, { useState, useEffect, useRef } from 'react';
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
  opacity: 0.4;
  fill: #F9FAFB;
  stroke: #F9FAFB;
  stroke-width: 1;
  filter: drop-shadow(0px 2px 0 black);
  --neon-light-center: #f9fafb;
  --neon-light-color: #0d9488;
  --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                  drop-shadow(0 0 6px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-color))
                  drop-shadow(0 0 8px var(--neon-light-color));
  &.arrowRotate-enter-active {
    animation: arrowDown 500ms linear, arrowLight 100ms linear 500ms, arrowRotateCC 1000ms cubic-bezier(0.22, 1, 0.36, 1) 600ms;
    @keyframes arrowDown {
      100% {
        filter: none;
      }
    }

    @keyframes arrowLight {
      0% {
        filter: none;
      }
      100% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
      }
    }
    @keyframes arrowRotateCC {
      0% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
        transform: rotate(0deg);
      }
      100% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
        transform: rotate(-180deg);
      }
    }

  };
  &.arrowRotate-enter-done {
    color: var(--neon-light-center);
    filter: var(--light-effect);
    transform: rotate(180deg);
  };

  &.arrowRotate-exit {
    color: var(--neon-light-center);
    filter: var(--light-effect);
    transform: rotate(-180deg);
  }
  &.arrowRotate-exit-active {
    animation: arrowRotateC 1000ms cubic-bezier(0.22, 1, 0.36, 1), arrowDark 100ms linear 1000ms, arrowUp 500ms linear 1100ms;

    @keyframes arrowRotateC {
      0% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
        transform: rotate(-180deg);
      }
      100% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
        transform: rotate(0deg);
      }
    }

    @keyframes arrowDark {
      0% {
        fill: var(--neon-light-center);
        filter: var(--light-effect);
        transform: rotate(0deg);
      }
      100% {
        fill: #F9FAFB;
        filter: none;
        transform: rotate(0deg);
      }
    }

    @keyframes arrowUp {
      0%{
        fill: #F9FAFB;
        filter: none;
        transform: rotate(0deg);
      }
      100% {
        fill: #F9FAFB;
        filter: drop-shadow(0px 2px 0 black);
        transform: rotate(0deg);
      }
    }

  };
`

interface TitleITF {
  isTitleOverflow: boolean;
  titleOffsetRight: number;
  isTitleTranslatingLeft: boolean;
  isTitleEllipsis: boolean;
}

const Title = styled.p<TitleITF>`
  ${tw`max-w-min opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap`};
  ${({ isTitleEllipsis }) => isTitleEllipsis && css`${tw`truncate`}`};
  font-size: 1.625rem;
  letter-spacing: -1.5px;
  text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  --distance: ${({titleOffsetRight}) => titleOffsetRight};
  --rate: 30;
  --duration: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  transition: transform var(--duration) linear;
  &:hover {
    ${tw`opacity-60 text-trueGray-50`};
  }
  ${({ isTitleOverflow }) => isTitleOverflow && css`${tw`cursor-pointer`}`};
  ${({isTitleOverflow, isTitleTranslatingLeft}) => isTitleOverflow && isTitleTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--duration) * 1s) linear;
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
    ${tw`stroke-current text-trueGray-50`};
    filter: var(--button-up)
            drop-shadow(0 0 7px #fff)
            drop-shadow(0 0 10px #fff)
            drop-shadow(0 0 21px #fff)
            drop-shadow(0 0 42px #0fa);
  }
  ${({ isEditing }) => isEditing && css`
    ${tw`stroke-current text-trueGray-50`};
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

  const [ isArrowTransitioning, setIsArrowTransitioning ] = useState(false);

  const handleArrowClick = () => {
    handleShowSlide();
    setIsArrowTransitioning(true);
  }

  useEffect(() => {
    const timer = () => setTimeout(() => {
      setIsArrowTransitioning(false);
    }, 1800);
    const arrowClickDelay = timer();
    return () => {clearTimeout(arrowClickDelay)}
  }, [isArrowTransitioning])

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
        <CSSTransition in={isShowingSlide} timeout={1600} classNames='arrowRotate' nodeRef={cardHeaderRef}>
          <StyledLeftArrow size={24} ref={cardHeaderRef} onClick={() => {!isEditing && !isArrowTransitioning && handleArrowClick()}} />
          {/* <StyledLeftArrow size={24} ref={cardHeaderRef} onClick={() => {!isEditing && handleShowSlide()}} /> */}
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