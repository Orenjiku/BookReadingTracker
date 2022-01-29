import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import DetailsView from './DetailsView';
import EditView from './EditView';
import { BookDetailsITF, ReadInstanceITF } from '../../../interfaces/interface';


interface CardViewerITF {
  bookDetails: BookDetailsITF;
  readInstanceList: ReadInstanceITF[];
  readInstanceIdx: number;
  isEdit: boolean;
  editTimer: number;
  isExpanded: boolean;
  expandTimer: number;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleUpdateReaderBook: Function;
}

const ViewExpandContainer = styled.div<{ $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full overflow-hidden`};
  max-height: 38%;
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  transition: all var(--expandDuration) ease-out;
  ${({ $isExpanded }) => $isExpanded && css`
    max-height: 0;
    transition: all var(--expandDuration) ease-out calc(var(--expandDuration) * 0.5);
  `}
`;

const DetailsViewContainer = styled.div<{ $editTimer: number; $isExpanded: boolean; $expandTimer: number }>`
  ${tw`relative h-full w-full bg-blueGray-500 bg-opacity-40`};
  --expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: all linear var(--expandDuration);
  &.slide-enter {
    transform: translateY(100%);
  }
  &.slide-enter-active {
    transform: translateY(0);
    transition: transform var(--editDuration) linear;
  }
  &.slide-exit {
    transform: translateY(0);
  }
  &.slide-exit-active {
    transform: translateY(100%);
    transition: transform var(--editDuration) linear;
  }
`;

const EditViewContainer = styled.div<{ $isExpanded: boolean; $editTimer: number; $expandTimer: number }>`
  ${tw`absolute top-0 left-0 h-full w-full overflow-hidden`};
  -expandDuration: ${({ $expandTimer }) => `${$expandTimer}ms`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: all linear var(--expandDuration);
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


const CardViewer = ({ bookDetails, readInstanceList, readInstanceIdx, isExpanded, expandTimer, isEdit, editTimer, isFlipped, flipTimer, indicatorTransitionTimer, handleUpdateReaderBook }: CardViewerITF) => {

  const [ overallDaysRead, setOverallDaysRead ] = useState(0);
  const [ overallDaysTotal, setOverallDaysTotal ] = useState(0);
  const [ overallAvgDailyRead, setOverallAvgDailyRead ] = useState(0);
  const [ overallMaxDailyRead, setOverallMaxDailyRead ] = useState(0);
  const [ timesRead, setTimesRead ] = useState(0);

  useEffect(() => {
    const overallPagesRead = readInstanceList.reduce((acc, cur) => acc + cur.pages_read, 0);
    const updatedOverallDaysRead = readInstanceList.reduce((acc, cur) => acc + cur.days_read, 0);
    setOverallMaxDailyRead(Math.max(...readInstanceList.map(readInstance => readInstance.max_daily_read)));
    setOverallAvgDailyRead(updatedOverallDaysRead > 0 ? Math.round(overallPagesRead / updatedOverallDaysRead) : 0);
    setOverallDaysRead(updatedOverallDaysRead);
    setOverallDaysTotal(readInstanceList.reduce((acc, cur) => acc + cur.days_total, 0));
    setTimesRead(readInstanceList.reduce((acc, cur) => acc += cur.is_finished ? 1 : 0, 0));
  }, [readInstanceList]);

  const viewDetails = [
    {key: 'Total Pages', value: bookDetails.total_pages},
    {key: 'Max Daily Read', value: overallMaxDailyRead},
    {key: 'Avg Daily Read', value: overallAvgDailyRead},
    {key: 'Total Days Read', value: overallDaysRead},
    {key: 'Total Days', value: overallDaysTotal},
    {key: 'Times Read', value: timesRead}
  ];

  const detailsViewRef = useRef<HTMLDivElement>(null);
  const editViewRef = useRef<HTMLDivElement>(null);

  return (
    <ViewExpandContainer $isExpanded={isExpanded} $expandTimer={expandTimer}>

    <CSSTransition in={!isEdit} timeout={editTimer} classNames='slide' nodeRef={detailsViewRef} unmountOnExit>
      <DetailsViewContainer ref={detailsViewRef} $editTimer={editTimer} $isExpanded={isExpanded} $expandTimer={expandTimer}>
        <DetailsView viewDetails={viewDetails} />
      </DetailsViewContainer>
    </CSSTransition>

    <CSSTransition in={isEdit} timeout={editTimer} classNames='slide' nodeRef={editViewRef} unmountOnExit>
      <EditViewContainer ref={editViewRef} $editTimer={editTimer} $isExpanded={isExpanded} $expandTimer={expandTimer}>
        <EditView readerBookId={readInstanceList[readInstanceIdx].reader_book_id} readInstanceId={readInstanceList[readInstanceIdx].ri_id} totalPages={bookDetails.total_pages} isEdit={isEdit} editTimer={editTimer} isFlipped={isFlipped} flipTimer={flipTimer} indicatorTransitionTimer={indicatorTransitionTimer} handleUpdateReaderBook={handleUpdateReaderBook} />
      </EditViewContainer>
    </CSSTransition>

    </ViewExpandContainer>
  )
};

export default CardViewer;
