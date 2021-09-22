import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';

const EditViewContainer = styled.div`
  ${tw`absolute top-0 left-0 h-full w-full flex justify-center items-center bg-blueGray-500 bg-opacity-40 overflow-hidden`};
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: transform 300ms linear;
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: transform 300ms linear;
  }
`

const DetailsViewEdit = ({isEditing}: {isEditing: boolean}) => {
  // const [ date, setDate ] = useState('');
  // const [ page, setPage ] = useState('');
  // const [ percent, setPercent ] = useState('');

  return (
    <CSSTransition in={isEditing} timeout={300} classNames='slide' unmountOnExit>
      <EditViewContainer>
        Edit Screen
      </EditViewContainer>
    </CSSTransition>
  )
}

export default DetailsViewEdit;