import React, { useState, useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';

const SlideContainer = styled.div`
  ${tw`relative h-full w-full rounded-b-2xl border-t border-trueGray-50 overflow-hidden`}
  user-select: none;
`

const StyledSlideButton = styled.div`
  ${tw`absolute h-full w-full bg-blue-300 rounded-b-2xl cursor-pointer flex justify-center items-center`};
  width: 25%;
`

// const InsideBar = styled.div`
//   ${tw`absolute h-full bg-red-300`};
//   width: calc(100% * 3);
// `

const SlideButton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideButtonRef = useRef<HTMLDivElement>(null);

  const [ isDragging, setIsDragging ] = useState(false);
  const offsetLeft = useRef(0);
  const leftStartPosition = useRef(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    window.addEventListener('mouseup', endDrag)
  }, []);

  useEffect(() => {
    window.onmousemove = isDragging ? onDrag : null;
  }, [isDragging]);

  useEffect(() => {
    console.log(atEnd)
  }, [atEnd]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    leftStartPosition.current = e.currentTarget.getBoundingClientRect().left
    offsetLeft.current =  e.clientX - leftStartPosition.current;
    setIsDragging(true);
  }

  const onDrag = (e: MouseEvent) => {
    if (slideButtonRef.current && containerRef.current && isDragging) {
      const leftCurrentPosition = e.clientX - offsetLeft.current - leftStartPosition.current;
      const leftEndPosition = containerRef.current.clientWidth - slideButtonRef.current.clientWidth;
      slideButtonRef.current.style.left = `${Math.min(Math.max(0, leftCurrentPosition), leftEndPosition)}px`;
      if (leftCurrentPosition >= leftEndPosition) setAtEnd(true);
      else if (leftCurrentPosition < leftEndPosition) setAtEnd(false);
    }
  }

  const endDrag = () => {
    setAtEnd(false);
    setIsDragging(false);
    if (slideButtonRef.current) {
      slideButtonRef.current.style.left = `0px`;
    }
  }

  return (
    <SlideContainer ref={containerRef}>
      <StyledSlideButton ref={slideButtonRef} onMouseDown={startDrag}>
        <ArrowRightSquare size={26} />
        {/* <InsideBar /> */}
      </StyledSlideButton>
    </SlideContainer>
  )
}

export default SlideButton;