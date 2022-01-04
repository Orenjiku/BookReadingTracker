import React, { useState, useEffect } from 'react';
import { BookITF } from '../interfaces/interface';
import Card from '../components/card/Card';

const CurrentlyReading = () => {
  const [ finishedReadingList, setFinishedReadingList ] = useState<BookITF[]>([]);

  useEffect(() => {
    getFinishedReadingList();
  }, []);

  const getFinishedReadingList = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/finished_reading');
      const result = await response.json();
      setFinishedReadingList(result);
    } catch(err) {
      console.error(err);
    }
  };

  const handleUpdateBookList = (readingList: BookITF[]) => {
    setFinishedReadingList(readingList);
  };

  return (
    <div className='flex flex-wrap justify-center'>
      {finishedReadingList.map((book) => {
        return <Card key={`${book.b_id}`} book={{...book, category: 'isFinished'}} handleUpdateBookList={handleUpdateBookList} />
      })}
    </div>
  )
};

export default CurrentlyReading;