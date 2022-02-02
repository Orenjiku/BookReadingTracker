import React, { useRef, memo } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import EditView from './EditView';


interface EditEntryViewPropsITF {
  readerBookId: number;
  readInstanceId: number;
  totalPages: number;
  isEdit: boolean;
  editTimer: number;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleUpdateReaderBook: Function;
};

const EditEntryContainer = styled.div<{ $editTimer: number }>`
  ${tw`absolute top-0 left-0 h-full w-full overflow-hidden`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: transform var(--editDuration) linear;
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: transform var(--editDuration) linear;
  }
`;

const EditEntryView = ({ readerBookId, readInstanceId, totalPages, isEdit, editTimer, isFlipped, flipTimer, indicatorTransitionTimer, handleUpdateReaderBook }: EditEntryViewPropsITF) => {
  const editEntryViewRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition in={isEdit} timeout={editTimer} classNames='slide' nodeRef={editEntryViewRef} unmountOnExit>
      <EditEntryContainer ref={editEntryViewRef} $editTimer={editTimer}>
        <EditView readerBookId={readerBookId} readInstanceId={readInstanceId} totalPages={totalPages} isEdit={isEdit} editTimer={editTimer} isFlipped={isFlipped} flipTimer={flipTimer} indicatorTransitionTimer={indicatorTransitionTimer} handleUpdateReaderBook={handleUpdateReaderBook} />
      </EditEntryContainer>
  </CSSTransition>
  )
};

export default memo(EditEntryView);