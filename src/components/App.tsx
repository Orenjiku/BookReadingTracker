import React, { useState, useEffect } from 'react';
// import { Book, ReadEntry } from '../interfaces/interface';
import { BookITF } from '../interfaces/interface';
import Card from './card/Card';

const App = (): JSX.Element => {
  // const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [finishedReading, setFinishedReading] = useState<BookITF[]>([]);
  // const [dailyReads, setDailyReads] = useState<ReadEntry[]>([]);

  useEffect(() => {
    // getDailyReads();
    // getCurrentlyReading();
    getFinishedReading();
  }, []);

  // const getDailyReads = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/1/daily_reads');
  //     const result = await response.json();
  //     setDailyReads(result);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // const getCurrentlyReading = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/1/currently_reading');
  //     const result = await response.json();
  //     setCurrentlyReading(result);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  const getFinishedReading = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/finished_reading');
      const result = await response.json();
      setFinishedReading(result);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className='bg-blueGray-300 flex flex-wrap'>
      {finishedReading.map((book) => {
        return <Card key={`${book.b_id}`} book={book} />
      })}
    </div>
  )
};

export default App;