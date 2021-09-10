import React, { useState, useEffect } from 'react';
// import { Book, ReadEntry } from '../interfaces/interface';
import { BookITF } from './interfaces/interface';
import Card from './components/card/Card';
import image from './assets/scott-webb-UjupleczBOY-unsplash.jpg'

const App = () => {
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
    <div className='flex flex-wrap justify-center' style={{backgroundImage: `url('${image}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {finishedReading.map((book) => {
        return <Card key={`${book.b_id}`} book={book} />
      })}
    </div>
  )
};

export default App;