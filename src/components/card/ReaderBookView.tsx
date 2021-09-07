import React from 'react';
import { ReaderBookITF } from '../../interfaces/interface';
import ReaderBook from './ReaderBook';

const ReaderBookView = ({ readerBookList, isUpdating }: { readerBookList: ReaderBookITF[]; isUpdating: boolean }) => {
  return (
    <div className='row-start-10 row-end-19 col-start-2 col-end-3 font-SortsMillGoudy-400'>
      {readerBookList.map(readerBook => (
        <ReaderBook key={readerBook.rb_id} readerBook={readerBook} isUpdating={isUpdating} />
      ))}
    </div>
  )
}

export default ReaderBookView;