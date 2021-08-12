import React, { useState, useEffect} from 'react';
import Book from './interfaces/book.interface';
import ReadEntry from './interfaces/readEntry.interface';

const App = (): JSX.Element => {
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);
  const [dailyReads, setDailyReads] = useState<ReadEntry[]>([]);

  useEffect(() => {
    getCurrentlyReading();
    getDailyReads();
  }, []);

  const getCurrentlyReading = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/currently_reading');
      const result = await response.json();
      setCurrentlyReading(result);
    } catch(err) {
      console.log(err);
    }
  }

  const getDailyReads = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/daily_reads');
      const result = await response.json();
      setDailyReads(result);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div>
      {currentlyReading.map(book =>
        <div>{book.title}</div>
      )}
      {dailyReads.map(read =>
        <div>{read.date_read}</div>
      )}
    </div>
  )
};

export default App;