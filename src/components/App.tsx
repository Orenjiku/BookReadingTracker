import React, { useState, useEffect } from 'react';
// import { Book, ReadEntry } from '../interfaces/interface';
import { BookITF } from '../interfaces/interface';
import Card from './card/Card';

const App = (): JSX.Element => {
  const [finishedReading, setFinishedReading] = useState<BookITF[]>([]);

  useEffect(() => {
    getFinishedReading();
  }, []);

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
    <div className='bg-blueGray-500 flex flex-wrap'>
      {finishedReading.map((book) => {
        return <Card key={`${book.b_id}`} book={book} />
      })}
    </div>
  )
};

export default App;