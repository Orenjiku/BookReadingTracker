import React from 'react';
import tw, { styled, css } from 'twin.macro';
import { ReadInstanceITF } from '../../../interfaces/interface';
import DetailsEntryView from './DetailsEntryView';
import EditEntryView from './EditEntryView';


interface CardViewerPropsITF {
  readInstanceList: ReadInstanceITF[];
  readInstanceIdx: number;
  totalPages: number;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleUpdateReaderBook: Function;
};

const ExpandViewContainer = styled.div<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full overflow-hidden`};
  max-height: 38%;
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--expandDuration) ease-out;
  ${({ $isExpanded }) => $isExpanded && css`
    max-height: 0;
    transition: all var(--expandDuration) ease-out calc(var(--expandDuration) * 0.5);
  `}
`;

const CardViewer = ({ readInstanceList, readInstanceIdx, totalPages, isExpanded, expandTimer, isEdit, editTimer, isFlipped, flipTimer, indicatorTransitionTimer, handleUpdateReaderBook }: CardViewerPropsITF) => {

  return (
    <ExpandViewContainer $isExpanded={isExpanded} $expandTimer={expandTimer}>

      <DetailsEntryView readInstanceList={readInstanceList} totalPages={totalPages} isEdit={isEdit} editTimer={editTimer} />

      <EditEntryView readerBookId={readInstanceList[readInstanceIdx].reader_book_id} readInstanceId={readInstanceList[readInstanceIdx].ri_id} totalPages={totalPages} isEdit={isEdit} editTimer={editTimer} isFlipped={isFlipped} flipTimer={flipTimer} indicatorTransitionTimer={indicatorTransitionTimer} handleUpdateReaderBook={handleUpdateReaderBook} />

    </ExpandViewContainer>
  )
};

export default CardViewer;
