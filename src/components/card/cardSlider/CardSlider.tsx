import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';


const SlideShowContainer = styled.div<{ $src?: string; $slideShowTimer: number }>`
  ${tw`relative col-start-1 col-end-3 row-start-4 row-end-20 rounded-tl-2xl flex justify-center items-center`};
  ${tw`bg-trueGray-100 overflow-hidden`};
  --duration: ${({ $slideShowTimer }) => `${$slideShowTimer}ms`};
  &::before {
    content: '';
    background: url('${({ $src }) => $src}');
    ${tw`absolute w-full h-full`};
    ${tw`bg-cover bg-center bg-no-repeat filter blur`};
  }
  &.slide-enter {
    transform: translateX(100%);
  }
  &.slide-enter-active {
    transform: translateX(0%);
    transition: transform var(--duration) cubic-bezier(0.22, 1, 0.36, 1);
  }
  &.slide-exit-active {
    transform: translateX(100%);
    transition: transform var(--duration) cubic-bezier(0.5, 0, 0.75, 0);
  }
`;

const BlurbContainer = styled.div`
  ${tw`z-10 p-4 rounded-tl-2xl rounded-tr rounded-br overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs`};
  height: 85%;
  width: 90%;
  ::-webkit-scrollbar {
    ${tw`bg-trueGray-50 bg-opacity-60 w-2 rounded-r`};
  }
  ::-webkit-scrollbar-thumb {
    ${tw`bg-trueGray-400 bg-opacity-70 rounded-r`};
    &:hover {
      ${tw`bg-trueGray-500`};
    }
  }
`;

const CardSlider = ({ blurb, bookCoverUrl, isSlideShow, slideShowTimer }: {blurb: string; bookCoverUrl: string; isSlideShow: boolean; slideShowTimer:number }) => {

  const slideShowRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='slide' nodeRef={slideShowRef} unmountOnExit>
      <SlideShowContainer ref={slideShowRef} $src={bookCoverUrl} $slideShowTimer={slideShowTimer}>
        <BlurbContainer>
          {blurb}
        </BlurbContainer>
      </SlideShowContainer>
    </CSSTransition>
  )
};

export default CardSlider;