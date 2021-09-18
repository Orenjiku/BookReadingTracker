import React, { useState, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import useXOverflow from '../../hooks/useXOverflow';
import useLeftPosition from '../../hooks/useLeftPosition';
import { CSSTransition } from 'react-transition-group';
import { LeftArrow } from '@styled-icons/boxicons-regular/LeftArrow';

interface CardHeaderPropsITF {
  title: string;
  author: string[];
  isSlideShow: boolean;
  slideShowTimer: number;
  handleSlideShow: Function;
}

const CardHeaderContainer = styled.div`
  ${tw`relative col-start-1 col-end-3 row-start-1 row-end-4 rounded-t-2xl overflow-hidden`};
  &::before {
    content: '';
    ${tw`absolute top-0 left-0 w-full h-full opacity-70`};
    background: linear-gradient(#DBEAFE 0, transparent 25%);
};
`

const StyledLeftArrow = styled(LeftArrow)<{slideShowTimer: number}>`
  ${tw`min-w-min opacity-40 stroke-current text-coolGray-50 stroke-1 cursor-pointer`};
  --arrow-shadow: drop-shadow(0px 2px 0px black);
  filter: var(--arrow-shadow);
  --slideShowTimer: ${({slideShowTimer}) => `${slideShowTimer}ms`};
  --neon-light-center: #f9fafb;
  --neon-light-color: #0d9488;
  --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                  drop-shadow(0 0 6px var(--neon-light-center))
                  drop-shadow(0 0 8px var(--neon-light-center))
                  drop-shadow(0 0 12px var(--neon-light-center))
                  drop-shadow(0 0 16px var(--neon-light-color));
  &:hover {
    ${tw`opacity-60`};
  }
  &.arrow-enter {
    opacity: 1;
  }
  &.arrow-enter-active {
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: filter calc(var(--slideShowTimer) * 3 / 8) linear;
  };
  &.arrow-enter-done {
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: all calc(var(--slideShowTimer) * 5 / 8) linear;
  };
  &.arrow-exit {
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
  }
  &.arrow-exit-active {
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    transition: filter calc(var(--slideShowTimer) * 5 / 8) linear;
  };
  &.arrow-exit-done {
    transition: all calc(var(--slideShowTimer) * 3 / 8) linear;
  }
`

// interface TitleITF {
//   isTitleOverflow: boolean;
//   titleOffsetRight: number;
//   isTitleTranslatingLeft: boolean;
//   isTitleEllipsis: boolean;
// }

// const Title = styled.p<TitleITF>`
//   ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap`};
//   ${({ isTitleEllipsis }) => isTitleEllipsis && css`${tw`truncate`}`};
//   font-size: 1.625rem;
//   letter-spacing: -1.5px;
//   text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
//   --distance: ${({titleOffsetRight}) => titleOffsetRight};
//   --rate: 30;
//   --duration: calc(var(--distance) / var(--rate) * 1s);
//   transform: translateX(0%);
//   transition: transform var(--duration) linear;
//   &:hover {
//     ${tw`opacity-60 text-trueGray-50`};
//   }
//   ${({ isTitleOverflow }) => isTitleOverflow && css`${tw`cursor-pointer`}`};
//   ${({isTitleOverflow, isTitleTranslatingLeft}) => isTitleOverflow && isTitleTranslatingLeft && css`
//     transform: translateX(calc(var(--distance) * -1px));
//     transition: transform var(--duration) linear;
//   `};
// `

// interface AuthorITF {
//   isAuthorOverflow: boolean;
//   authorOffsetRight: number;
//   isAuthorTranslatingLeft: boolean;
//   isAuthorEllipsis: boolean;
// }

// const Author = styled.p<AuthorITF>`
//   ${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`};
//   ${({ isAuthorEllipsis }) => isAuthorEllipsis && css`${tw`truncate`}`};
//   --distance: ${({authorOffsetRight}) => authorOffsetRight};
//   --rate: 30;
//   --duration: calc(var(--distance) / var(--rate) * 1s);
//   transform: translateX(0%);
//   transition: transform var(--duration) linear;
//   ${({ isAuthorOverflow }) => isAuthorOverflow && css`${tw`cursor-pointer`}`};
//   ${({isAuthorOverflow, isAuthorTranslatingLeft}) => isAuthorOverflow && isAuthorTranslatingLeft && css`
//     transform: translateX(calc(var(--distance) * -1px));
//     transition: transform var(--duration) linear;
//   `};
// `

interface TextITF {
  bookTitle?: true;
  author?: true;
  isOverflow: boolean;
  offsetRight: number;
  isTranslatingLeft: boolean;
  isEllipsis: boolean;
}

const Text = styled.p<TextITF>`
  ${({ bookTitle }) => bookTitle && css`
    ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap`};
    font-size: 1.625rem;
    letter-spacing: -1.5px;
    text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  `};
  ${({ author }) => author && css`${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`}`};
  ${({ isEllipsis }) => isEllipsis && css`${tw`truncate`}`};
  --distance: ${({offsetRight}) => offsetRight};
  --rate: 30;
  --duration: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  transition: transform var(--duration) linear;
  ${({ isOverflow }) => isOverflow && css`${tw`cursor-pointer`}`};
  ${({isOverflow, isTranslatingLeft}) => isOverflow && isTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--duration) linear;
  `};
`

// const Title = styled(OverflowP)`
//   ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap`};
//   font-size: 1.625rem;
//   letter-spacing: -1.5px;
//   text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
// `

// const Author = styled(OverflowP)`
//   ${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`};
// `

const CardHeader = ({title, author, isSlideShow, slideShowTimer, handleSlideShow}: CardHeaderPropsITF) => {

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

  const [ isArrowAnimating, setIsArrowAnimating ] = useState(false);

  const handleArrowClick = () => {
    handleSlideShow();
    setIsArrowAnimating(true);
  }

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
    <CardHeaderContainer>

      <div className='flex items-center justify-start pl-2 -mb-1.5'>
        {/* <CSSTransition in={isSlideShow} timeout={{enter: 400, exit: 200}} classNames='arrow' nodeRef={cardHeaderRef}> */}
        <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='arrow' nodeRef={cardHeaderRef} onEntered={() => setIsArrowAnimating(false)} onExited={() => setIsArrowAnimating(false)}>
          <StyledLeftArrow size={26} ref={cardHeaderRef} slideShowTimer={slideShowTimer} onClick={() => !isArrowAnimating && handleArrowClick()} />
        </CSSTransition>
        <div className='ml-2 mr-5 overflow-hidden'>
          {/* <Title ref={bookTitleRef} isTitleOverflow={isTitleOverflow} titleOffsetRight={titleOffsetRight} onClick={() => handleClick('title')} isTitleTranslatingLeft={isTitleTranslatingLeft} onTransitionEnd={() => handleEllipsis('title')} isTitleEllipsis={isTitleEllipsis} {...(isTitleOverflow && {title: title})}>{title}</Title> */}
          <Text bookTitle ref={bookTitleRef} isOverflow={isTitleOverflow} offsetRight={titleOffsetRight} onClick={() => handleClick('title')} isTranslatingLeft={isTitleTranslatingLeft} onTransitionEnd={() => handleEllipsis('title')} isEllipsis={isTitleEllipsis} {...(isTitleOverflow && {title: title})}>{title}</Text>
        </div>
      </div>

      <div className='relative ml-2 mr-5 flex justify-end'>
        <div className='ml-16 overflow-hidden'>
          {/* <Author ref={bookAuthorRef} isAuthorOverflow={isAuthorOverflow} authorOffsetRight={authorOffsetRight} onClick={() => handleClick('author')} isAuthorTranslatingLeft={isAuthorTranslatingLeft} onTransitionEnd={() => handleEllipsis('author')} isAuthorEllipsis={isAuthorEllipsis} {...(isAuthorOverflow && {title: authors})}>{authors}</Author> */}
          <Text author ref={bookAuthorRef} isOverflow={isAuthorOverflow} offsetRight={authorOffsetRight} onClick={() => handleClick('author')} isTranslatingLeft={isAuthorTranslatingLeft} onTransitionEnd={() => handleEllipsis('author')} isEllipsis={isAuthorEllipsis} {...(isAuthorOverflow && {title: authors})}>{authors}</Text>
        </div>
      </div>

    </CardHeaderContainer>
  )
}

export default CardHeader;