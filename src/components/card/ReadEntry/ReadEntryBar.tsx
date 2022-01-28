import React from 'react';
import { ReadEntryITF } from '../../../interfaces/interface';
import ProgressBar from './ProgressBar';
import ReadEntryText from './ReadEntryText';


const ReadEntryBar = ({ readEntry, isEdit, editTimer, handleEntrySelect, handleReadEntrySelectToggle}: { readEntry: ReadEntryITF; isEdit: boolean; editTimer: number; handleEntrySelect: Function; handleReadEntrySelectToggle: Function }) => {

  const currentPercent = Number(readEntry.current_percent.toFixed(0));

  return (
    <div className={`px-1 pb-0.5 ${isEdit && 'cursor-pointer hover:bg-blueGray-400 hover:bg-opacity-30'}`} onClick={() => {handleEntrySelect(); handleReadEntrySelectToggle()}}>
      <ReadEntryText dateRead={readEntry.date_read} currentPage={readEntry.current_page} pagesRead={readEntry.pages_read} currentPercent={currentPercent} isEdit={isEdit} />
      <ProgressBar isEdit={isEdit} editTimer={editTimer} currentPercent={currentPercent} />
    </div>
  )
};

export default ReadEntryBar;