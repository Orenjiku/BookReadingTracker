import React from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';


const EditViewContainer = styled.div<{ $editTimer: number }>`
  ${tw`absolute top-0 left-0 h-full w-full flex justify-center items-center bg-blueGray-500 bg-opacity-40 overflow-hidden`};
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: transform var(--duration) ease-out;
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: transform var(--duration) ease-in;
  }
`;

const DetailsViewEdit = ({ isEdit, editTimer }: { isEdit: boolean; editTimer: number }) => {
  // const [ date, setDate ] = useState('');
  // const [ page, setPage ] = useState('');
  // const [ percent, setPercent ] = useState('');

  return (
    <CSSTransition in={isEdit} timeout={editTimer} classNames='slide' unmountOnExit>
      <EditViewContainer $editTimer={editTimer}>
        Edit Screen
      </EditViewContainer>
    </CSSTransition>
  )
}

export default DetailsViewEdit;