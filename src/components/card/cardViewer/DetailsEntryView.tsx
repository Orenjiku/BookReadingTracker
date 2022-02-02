import React, { useState, useEffect, useRef, memo } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import DetailsCarouselView from './DetailsCarouselView';
import { ReadInstanceITF } from '../../../interfaces/interface';


interface DetailsEntryViewPropsITF {
  readInstanceList: ReadInstanceITF[];
  totalPages: number;
  isEdit: boolean;
  editTimer: number;
};

const DetailsEntryContainer = styled.div<{ $editTimer: number }>`
  ${tw`relative h-full w-full bg-blueGray-500 bg-opacity-40`};
  --editDuration: ${({ $editTimer }) => `${$editTimer}ms`};
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

const DetailsEntryView = ({ readInstanceList, totalPages, isEdit, editTimer }: DetailsEntryViewPropsITF) => {
  const [ overallDaysRead, setOverallDaysRead ] = useState(0);
  const [ overallDaysTotal, setOverallDaysTotal ] = useState(0);
  const [ overallAvgDailyRead, setOverallAvgDailyRead ] = useState(0);
  const [ overallMaxDailyRead, setOverallMaxDailyRead ] = useState(0);
  const [ timesRead, setTimesRead ] = useState(0);

  const detailsEntryViewRef = useRef<HTMLDivElement>(null);

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
    {key: 'Total Pages', value: totalPages},
    {key: 'Max Daily Read', value: overallMaxDailyRead},
    {key: 'Avg Daily Read', value: overallAvgDailyRead},
    {key: 'Total Days Read', value: overallDaysRead},
    {key: 'Total Days', value: overallDaysTotal},
    {key: 'Times Read', value: timesRead}
  ];

  return (
    <CSSTransition in={!isEdit} timeout={editTimer} classNames='slide' nodeRef={detailsEntryViewRef} unmountOnExit>
      <DetailsEntryContainer ref={detailsEntryViewRef} $editTimer={editTimer}>
        <DetailsCarouselView viewDetails={viewDetails} />
      </DetailsEntryContainer>
    </CSSTransition>
  )
};

export default memo(DetailsEntryView);