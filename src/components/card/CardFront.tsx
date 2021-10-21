import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookDetailsITF, ReaderBookITF, ReadEntryITF } from '../../interfaces/interface';
import CardHeader from './CardHeader';
import BookImage from './BookImage';
import DetailsView from './DetailsView';
import ReaderBook from './ReaderBook';
import ReadInstance from './ReadInstance';
import CompletionSlider from './CompletionSlider';
import { Edit } from '@styled-icons/boxicons-regular/Edit';


interface CardFrontPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  readerBook: ReaderBookITF;
  isFlipped: boolean;
  flipTimer: number;
  handleFlip: Function
}

const CardFrontContainer = styled.div<{ $isFlipped: boolean; $flipTimer: number }>`
  ${tw`absolute h-full w-full rounded-2xl grid grid-cols-2 grid-rows-21`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  ${tw`overflow-hidden select-none`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(0deg);
  --flipDuration: ${({ $flipTimer }) => `${$flipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFlipped }) => $isFlipped && css`
    transform: perspective(1200px) rotateY(-180deg);
    pointer-events: none;
  `}
`;

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

const StyledEdit = styled(Edit)<{ $isEdit: boolean, $editTimer: number }>`
  ${tw`absolute top-1.5 right-1 min-w-min opacity-50 stroke-1 stroke-current text-coolGray-50 cursor-pointer`};
  filter: drop-shadow(0px 1px 0 black);
  --duration: ${({ $editTimer }) => `${$editTimer}ms`};
  transition: all var(--duration) linear;
  ${({ $isEdit }) => !$isEdit && css`
    &:hover {
      ${tw`opacity-70`};
    }
  `}
  ${({ $isEdit }) => $isEdit && css`
    --neon-light-center: #f9fafb;
    --neon-light-color: #0d9488;
    --light-effect: drop-shadow(0 0 4px var(--neon-light-center))
                    drop-shadow(0 0 6px var(--neon-light-center))
                    drop-shadow(0 0 8px var(--neon-light-center))
                    drop-shadow(0 0 12px var(--neon-light-center))
                    drop-shadow(0 0 16px var(--neon-light-color));
    opacity: 1;
    color: var(--neon-light-center);
    filter: var(--light-effect);
    fill: none;
    transition: all var(--duration) linear;
  `}
`;

const CardFront = ({ bookDetails, author, readerBook, isFlipped, flipTimer, handleFlip }: CardFrontPropsITF) => {
  // const [ isAnyReading, setIsAnyReading ] = useState(readerBook.is_any_reading);
  // const [ isAnyFinished, setIsAnyFinished ] = useState(readerBook.is_any_finished);
  // const [ isAllDnf, setIsAllDnf ] = useState(readerBook.is_all_dnf);

  const startIdx = readerBook.read_instance.length > 1 && readerBook.is_any_reading ? readerBook.read_instance.findIndex(readInstance => readInstance.is_reading === true) : 0;
  const [ readInstanceList, setReadInstanceList ] = useState(readerBook.read_instance);
  const [ readInstanceIdx, setReadInstanceIdx ] = useState(startIdx);

  const [ overallPagesRead, setOverallPagesRead ] = useState(readInstanceList.reduce((acc, cur) => acc + cur.pages_read, 0));
  const [ overallDaysRead, setOverallDaysRead ] = useState(readInstanceList.reduce((acc, cur) => acc + cur.days_read, 0));
  const [ overallDaysTotal, setOverallDaysTotal ] = useState(readInstanceList.reduce((acc, cur) => acc + cur.days_total, 0));
  const [ overallAvgDailyRead, setOverallAvgDailyRead ] = useState(overallDaysRead > 0 ? Math.round(overallPagesRead / overallDaysRead) : 0);
  const [ overallMaxDailyRead, setOverallMaxDailyRead ] = useState(Math.max(...readInstanceList.map(readInstance => readInstance.max_daily_read)));
  const timesRead = readerBook.is_any_finished ? readInstanceList.reduce((acc, cur) => acc += cur.is_finished ? 1 : 0, 0) : 0;
  // const [ timesRead, setTimesRead ] = useState(readerBook.is_any_finished ? readInstanceList.reduce((acc, cur) => acc += cur.is_finished ? 1 : 0, 0) : 0);

  const viewDetails = [
    {key: 'Total Pages', value: bookDetails.total_pages},
    {key: 'Max Daily Read', value: overallMaxDailyRead},
    {key: 'Avg Daily Read', value: overallAvgDailyRead},
    {key: 'Total Days Read', value: overallDaysRead},
    {key: 'Total Days', value: overallDaysTotal},
    {key: 'Times Read', value: timesRead}
  ];

  //transition conditions
  const [ isEdit, setIsEdit ] = useState(false);
  const [ isSlideShow, setIsSlideShow ] = useState(false);
  const [ isReading, setIsReading ] = useState(false);
  const [ isExpanded, setIsExpanded ] = useState(false);

  const slideShowRef = useRef(null);

  const slideShowTimer = 800;
  const expandTimer = 300;
  const editTimer = 300;

  const handleShowSlideShow = () => setIsSlideShow(isSlideShow => !isSlideShow);
  const handleIsEdit = () => setIsEdit(isEdit => !isEdit);
  const handleIsExpanded = () => setIsExpanded(isExpanded => !isExpanded);
  //---

  useEffect(() => {
    if (readerBook.read_instance.length === 1) {
      setIsReading(readerBook.is_any_reading);
    }
  }, []);

  useEffect(() => {
    const newOverallAvgDailyRead = overallDaysRead > 0 ? Math.round(overallPagesRead / overallDaysRead) : 0;
    setOverallAvgDailyRead(newOverallAvgDailyRead);
  }, [overallPagesRead, overallDaysRead]);

  const handleIsReading = (isReading: boolean) => setIsReading(isReading);
  const handleChangeReadInstanceIdx = (i: number) => setReadInstanceIdx(i);

  const handleDeleteReadEntry = (readEntryInput: ReadEntryITF) => {
    //first call API to delete readEntry from database then update locally
    const currentReadInstance = [...readInstanceList][readInstanceIdx]; //create copy of current readInstance to update properties before updating readInstanceList.
    const currentReadEntryList = currentReadInstance!.read_entry!;
    const deleteReadEntryIdx = currentReadEntryList.findIndex(readEntry => readEntry.re_id === readEntryInput.re_id);

    //Update overall pages_read (i.e. read_instance.pages_read) or readEntry pages_read. readEntry listed by date DESC order, therefore "next" is index - 1, "prev" is index + 1.
    if (deleteReadEntryIdx === 0) {
      const prevCurrentPage = currentReadEntryList.length === 1 ? 0 : currentReadEntryList[deleteReadEntryIdx + 1].current_page
      setOverallPagesRead(prevOverallPagesRead => prevOverallPagesRead - currentReadEntryList[deleteReadEntryIdx].pages_read);
      currentReadInstance.pages_read = prevCurrentPage; //set read_instance.pages_read to next most recent read_entry's current_page.
      //call API update read_instance.pages_read with prevCurrentPage.
    } else {
      const nextReadEntry = currentReadEntryList[deleteReadEntryIdx - 1]; //deleteReadEntryIdx - 1 is the next readEntry by date. (i.e. more recent)
      nextReadEntry.pages_read += readEntryInput.pages_read; //add pages_read of deleteReadEntry to next readEntry.
      //call API, find nextReadEntry.re_id and update its pages_read with nextReadEntry.pages_read.
    }

    //update totalDaysRead. check if deleteReadEntryDate is the only entry on that date.
    const deleteReadEntryDate = new Date(readEntryInput.date_read).toDateString();
    const duplicates = currentReadEntryList.filter(readEntry => new Date(readEntry.date_read).toDateString() === deleteReadEntryDate).length;
    if (duplicates === 1) {
      setOverallDaysRead(prevOverallDaysRead => prevOverallDaysRead - 1); //read_instance.total_days_read is a calculated value on API call. Not necessary to update database.
      currentReadInstance.days_read -= 1;
    }

    //readEntry listed by date DESC order, therefore update totalDays only if deleteReadEntry is the only entry, the most recent entry, or the oldest entry.
    if (deleteReadEntryIdx === 0 || deleteReadEntryIdx === currentReadEntryList.length - 1) {
      setOverallDaysTotal(prevOverallDaysTotal => prevOverallDaysTotal - 1);
      currentReadInstance.days_total -= 1;
    }

    //update read_instance.max_daily_read
    currentReadInstance.max_daily_read = currentReadEntryList.reduce((acc, cur, i) => cur.pages_read > acc && i !== deleteReadEntryIdx ? cur.pages_read : acc, 0);

    const newReadEntryList = currentReadEntryList.filter((readEntry: ReadEntryITF) => readEntry.re_id !== readEntryInput.re_id); //create newReadEntryList with deleteReadEntry removed.
    const newReadInstance = {...currentReadInstance, read_entry: newReadEntryList}; //create newReadInstance with updated newReadEntryList
    const newReadInstanceList = [...readInstanceList]; //copy newReadInstanceList and replace readInstance with newReadInstance
    newReadInstanceList.splice(readInstanceIdx, 1, newReadInstance);
    setReadInstanceList(newReadInstanceList);

    //overallMaxDailyRead must be updated last, using newReadInstanceList and updated readEntry.pages_read.
    const combinedReadEntry = newReadInstanceList.reduce((acc, cur) => acc.concat(cur.read_entry || []), [] as ReadEntryITF[]);
    const newOverallMaxDailyRead = Math.max(...combinedReadEntry.map(readEntry => readEntry.pages_read));
    setOverallMaxDailyRead(newOverallMaxDailyRead); //read_instance.max_daily_read is a calculated value on API call. Not necessary to update database.
  };

  // const deleteReadEntry = async (re_id: number) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/1/read_entry`, {
  //       method: 'DELETE',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({re_id})
  //     });
  //     if (response.ok) {

  //     }
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // const handleAddReadEntry = (readEntry: ReadEntryITF) => {
  //   //sort by date descending.
  //   // const newReadEntryList = readInstance?.read_entry?.concat(readEntry).sort((a, b) => Number(new Date(b.date_read)) - Number(new Date(a.date_read)));
  //   // setReadInstance({...readInstance, read_entry: newReadEntryList});
  // };

  return (
    <CardFrontContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>

      <CardHeader title={bookDetails.title} author={author} isFlipped={isFlipped} flipTimer={flipTimer} isSlideShow={isSlideShow} slideShowTimer={slideShowTimer} handleShowSlideShow={handleShowSlideShow} />

      <BookImage pictureUrl={bookDetails.picture_url} isEdit={isEdit} editTimer={editTimer} handleFlip={handleFlip} />

      <div className='col-start-2 col-end-3 row-start-4 row-end-20 flex flex-col overflow-hidden'>
        <DetailsView viewDetails={viewDetails} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} />
        {readInstanceList.length <= 1
          ? <ReadInstance readInstance={readInstanceList[readInstanceIdx]} isEdit={isEdit} editTimer={editTimer} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleDeleteReadEntry={handleDeleteReadEntry}/>
          : <ReaderBook readInstanceList={readInstanceList} readInstanceIdx={readInstanceIdx} isEdit={isEdit} editTimer={editTimer} handleIsReading={handleIsReading} isExpanded={isExpanded} expandTimer={expandTimer} handleIsExpanded={handleIsExpanded} handleChangeReadInstanceIdx={handleChangeReadInstanceIdx} handleDeleteReadEntry={handleDeleteReadEntry}/>
        }
      </div>

      <div className='col-start-1 col-end-3 row-start-20 row-end-22'>
        <CompletionSlider isReading={isReading} />
      </div>

      <StyledEdit size={22} $isEdit={isEdit} $editTimer={editTimer} onClick={() => handleIsEdit()} />

      <CSSTransition in={isSlideShow} timeout={slideShowTimer} classNames='slide' nodeRef={slideShowRef} unmountOnExit>
        <SlideShowContainer ref={slideShowRef} $src={bookDetails.picture_url} $slideShowTimer={slideShowTimer}>
          <div className='z-10 h-4/5 w-11/12 p-4 rounded-tl-2xl overflow-y-scroll whitespace-pre-wrap select-text bg-trueGray-50 bg-opacity-60 text-xs font-Helvetica'>
            {bookDetails.blurb}
          </div>
        </SlideShowContainer>
      </CSSTransition>

    </CardFrontContainer>
  )
}

export default CardFront;